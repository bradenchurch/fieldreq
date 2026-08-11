import express from 'express';
import cors from 'cors';
import twilio from 'twilio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper to get data paths (handles dev vs vercel)
const getDataPath = (filename) => {
  return path.join(__dirname, filename);
};

// Initialize or read responses
let responsesData = { checkIns: [], responses: [] };
try {
  const data = fs.readFileSync(getDataPath('responses.json'), 'utf8');
  responsesData = JSON.parse(data);
} catch (e) {
  // Ignore, use default
}

let crewData = { project: "Pearson Elementary", crew: [] };
try {
  const data = fs.readFileSync(getDataPath('crew.json'), 'utf8');
  crewData = JSON.parse(data);
} catch (e) {
  // Ignore
}

const saveResponses = () => {
  try {
    fs.writeFileSync(getDataPath('responses.json'), JSON.stringify(responsesData, null, 2));
  } catch (e) {
    console.error("Failed to save responses", e);
  }
};

// --------------------------------------------------------
// Twilio config
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || process.env.TWILIO_API_KEY_SECRET; // Handle both
const twilioPhone = process.env.TWILIO_PHONE;
let client = null;

if (twilioAccountSid && twilioAuthToken) {
  client = twilio(twilioAccountSid, twilioAuthToken);
}

// --------------------------------------------------------
// 1. Inbound SMS (Twilio webhook)
app.post('/api/twilio/inbound', (req, res) => {
  const { Body, From } = req.body;
  if (!Body || !From) {
    return res.status(400).send('Missing Body or From');
  }

  const messageText = Body.trim().toLowerCase();
  
  // Very simple language detection based on Spanish keywords
  const spanishKeywords = ['qué', 'necesito', 'dónde', 'hola', 'si', 'sí', 'gracias', 'madera', 'clavos', 'cemento', 'jefe', 'material'];
  const isSpanish = spanishKeywords.some(keyword => messageText.includes(keyword));
  
  // Find crew member
  const member = crewData.crew.find(c => c.phone === From) || { name: 'Unknown', preferred_language: isSpanish ? 'es' : 'en' };
  const language = member.preferred_language === 'es' || isSpanish ? 'es' : 'en';

  // Basic intent classification
  const isMaterialReq = messageText.includes('need') || messageText.includes('necesito') || messageText.includes('material') || messageText.includes('short on') || messageText.includes('falta');

  // Record response
  responsesData.responses.push({
    id: Date.now().toString(),
    name: member.name,
    phone: From,
    message: Body,
    project: crewData.project,
    timestamp: new Date().toISOString(),
    isMaterialReq,
    language
  });
  saveResponses();

  // Generate TwiML response
  const twiml = new twilio.twiml.MessagingResponse();
  let replyMsg = '';

  if (isMaterialReq) {
    replyMsg = language === 'es' 
      ? `¡Recibido! Agregado a la lista de ${crewData.project}.`
      : `Got it — added to the ${crewData.project} list.`;
  } else {
    replyMsg = language === 'es'
      ? `¡Entendido! Le avisaré al jefe.`
      : `Got it! I'll let the boss know.`;
  }

  twiml.message(replyMsg);
  res.type('text/xml').send(twiml.toString());
});

// --------------------------------------------------------
// 2. Trigger check-in
app.post('/api/check-in/send', async (req, res) => {
  if (!client) {
    console.log("No Twilio client configured. Simulating SMS check-in.");
  }

  const results = [];
  const timestamp = new Date().toISOString();

  for (const member of crewData.crew) {
    const msg = member.preferred_language === 'es'
      ? `Hola ${member.name}. ¿Necesitan materiales para ${crewData.project} la próxima semana?`
      : `Hey ${member.name}. Materials needed for ${crewData.project} next week?`;

    try {
      if (client && twilioPhone) {
        await client.messages.create({
          body: msg,
          from: twilioPhone,
          to: member.phone
        });
      }
      results.push({ name: member.name, phone: member.phone, status: 'sent', timestamp });
    } catch (error) {
      console.error(`Failed to send to ${member.name}:`, error);
      results.push({ name: member.name, phone: member.phone, status: 'failed', error: error.message, timestamp });
    }
  }

  responsesData.checkIns.push({
    id: Date.now().toString(),
    timestamp,
    project: crewData.project,
    sentTo: results.length,
    details: results
  });
  saveResponses();

  res.json({ success: true, sent: results.length, results });
});

// --------------------------------------------------------
// 3. Get responses
app.get('/api/check-in/responses', (req, res) => {
  res.json({
    project: crewData.project,
    crew: crewData.crew,
    checkIns: responsesData.checkIns,
    responses: responsesData.responses
  });
});

export default app;

app.use((req, res, next) => {
  console.log("404 Hit:", req.method, req.url);
  res.status(404).send("Not Found");
});
