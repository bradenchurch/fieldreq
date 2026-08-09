# FieldReq — Product Specification

## What It Is
An AI operations assistant that lives in your crew's text messages. FieldReq handles material lists, equipment requests, safety check-ins, job specs, and more — all through SMS. No apps to install. No logins for crew. Your company gets its own phone number with an AI that knows your projects, your crew, your specs, and your equipment.

---

## Pricing — $49/month

| Plan | Price | What you get |
|---|---|---|
| **FieldReq** | **$49/mo** | Unlimited projects, crew, material lists, equipment requests, knowledge base, 7-day free trial |

| What they spend now | Time per week | Monthly cost |
|---|---|---|
| Text each crew member individually | 30-60 min | |
| Chase non-responders | 20-30 min | |
| Consolidate replies into one list | 20-40 min | |
| Fix ordering mistakes from bad info | ??? | |
| **Total labor wasted** | **1-3 hrs/week** | **$200-$1,200/mo** |

At $49, FieldReq delivers a **10x-40x ROI**. No setup fees. No per-seat pricing. Cancel anytime.

### COGS & Margin

| Per-account cost driver | Monthly cost |
|---|---|
| Twilio number | $1.15 |
| SMS messages | ~$3-5 |
| LLM API calls (Gemini Flash) | ~$0.50-1.00 |
| pgvector storage | Negligible |
| Embedding generation | Negligible |
| **Total COGS** | **~$5-7/mo** |
| **Gross margin** | **~85%** |

---

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  Vite+React │────▶│ Vercel API   │────▶│  Supabase    │
│  Frontend   │     │ (Express)    │     │  (PG+pgvector│
└─────────────┘     └──────┬───────┘     │   +Auth)     │
                           │             └──────────────┘
                    ┌──────▼───────┐     ┌──────────────┐
                    │   Twilio     │────▶│  Crew SMS    │
                    │   Webhooks   │◀────│  Replies     │
                    └──────┬───────┘     └──────────────┘
                           │
                    ┌──────▼───────┐
                    │ BusyBusy API │  (equipment GPS,
                    │ (integration)│   hours, assignments)
                    └──────────────┘
```

---

## Auth — Supabase Magic Link

- Boss enters email on login page
- Supabase sends magic link email
- Click → authenticated session (JWT stored in cookie)
- No passwords. No reset flows. No friction.
- Protected routes redirect unauthenticated users to `/login`

---

## Phone Numbers — One Per Company (Rent/Cancel)

Each company gets a dedicated Twilio phone number. Provisioned at signup, released if trial doesn't convert. The number *is* the tenant — no routing logic, no cross-contamination risk.

| Scenario | Action |
|---|---|
| Trial signup | Twilio API buys a number → assigns to company |
| Converts to paid | Number persists, ongoing $1.15/mo |
| Trial expires / cancels | Twilio API releases number → cost stops |
| Reactivates later | New number provisioned |

---

## Data Isolation — Zero Cross-Contamination

Enforced at **five layers** in deterministic code — never by the LLM:

| Layer | Mechanism | Why it can't fail |
|---|---|---|
| **Phone number** | Each company has a unique Twilio number | Physical tenant isolation at entry point |
| **Middleware** | JWT → profile_id on every API request, enforced before any handler runs | No auth = no data |
| **Database** | Every query has `WHERE profile_id = $1` + RLS policies | Query literally can't return wrong data |
| **pgvector** | `WHERE profile_id = $1` applied BEFORE similarity search | Embedding search never crosses accounts |
| **LLM context** | Assembled per-request from scratch, stateless | No cached data from other requests |

The LLM never decides which company's data to fetch — it never fetches data at all. Deterministic code does. The LLM's only job is writing natural-language responses from context we hand it.

---

## Deterministic Tool Router

The LLM never decides what action to take. That's a code problem solved with pattern matching + keyword classification.

### Flow

```
Crew SMS arrives → FieldReq number

┌─ ROUTER (code, deterministic) ────────────────┐
│                                                 │
│  1. Twilio number → Company ID (instant)        │
│  2. Crew phone → Crew member (DB lookup)        │
│  3. Classify intent (keyword + pattern match)   │
│  4. Execute tool (DB write or API call)          │
│  5. Assemble context (intent result + data)      │
│  6. Feed context to LLM for natural response     │
└─────────────────────────────────────────────────┘
```

### Intent Classification Map (code, not LLM)

| Keywords/Patterns | Intent | Tool Action |
|---|---|---|
| `need`, `get me`, `order`, `bring`, `add` | `material_request` | INSERT material_items |
| `spec`, `size`, `what`, `how many`, `which` | `knowledge_query` | pgvector search → return |
| `broken`, `smoking`, `error`, `won't start` | `maintenance_issue` | INSERT issues, notify boss |
| `done`, `finished`, `completed`, `wrapped` | `status_update` | Log progress |
| `where`, `address`, `directions`, `location` | `equipment_query` | Check BusyBusy GPS / DB |
| `hours`, `time`, `today`, `worked` | `time_entry` | Log timesheet |
| `hurt`, `injury`, `accident`, `fell` | `incident_report` | Alert boss immediately |
| `all good`, `fine`, `ok`, `clear`, `safe` | `safety_checkin` | Log confirmation |
| `need`, `reserve`, `book` + equipment name | `equipment_request` | INSERT equipment_reservation |
| `who`, `who's on`, `crew`, `working` + project | `crew_query` | Lookup project assignments |

### Example

```
SMS: "I need 20 concrete anchors for Pearson"

ROUTER: material_request
  ├── Extract: quantity="20", item="concrete anchors", project="Pearson"
  ├── Execute: INSERT material_items (crew_id, project_id, raw_text, parsed_items)
  ├── Context: { intent: "material_request", added: true, week_total: "8 items", outstanding: "Jose" }
  └── LLM: "Got it — 20 concrete anchors for Pearson. That's 8 items on the list so far. Still waiting on Jose."
```

---

## Proactive VA — The Agent Learns Without Burdening the Boss

**The rule:** The boss never gets interrupted unless it's urgent. The agent figures things out on its own or quietly learns over time. The boss should feel *served*, not *utilized*.

### Design Philosophy

| Burden feeling (what we avoid) | Proactive VA feeling (what we deliver) |
|---|---|
| "I have to upload docs" | "I forwarded that quote and my agent already knows it" |
| "I have to correct the AI" | "My VA is getting sharper — it knew the spec this week" |
| "I have to confirm every classification" | "Haven't had to fix anything in weeks" |
| "I have to fill knowledge gaps" | "Glanced at the Friday email, replied to one thing in 30 seconds" |

The Friday email is the **only touchpoint.** Everything else happens in the background. The boss's job is to use FieldReq, not train it. Training is a byproduct.

### Five Silent Learning Loops

**1 — Best-Guess Learning (no boss involvement)**

When the agent doesn't know something, it finds the closest match, states its uncertainty, and learns from the response:

```
Crew: "What's the concrete spec for Pioneer retaining wall?"
Agent: searches pgvector → no direct match for Pioneer
Agent: searches similar projects → Pearson uses "3000 PSI, 6\" slump"
Agent: "I don't have the Pioneer spec specifically, but Pearson
       uses 3000 PSI, 6\" slump with rebar on 12\" centers.
       Does that apply?"

Crew: "Yeah same thing"
→ Agent logs: Pioneer concrete = Pearson concrete (ID 8472)
→ Knowledge base updated silently
→ Confidence increased for both projects
→ Boss never sees this interaction
```

**2 — Self-Healing Router Confidence**

The router gets smarter through volume alone. No boss correction needed:

```
Week 1:
  Crew: "grab me 20 concrete anchors"
  Router: medium confidence (65%) → material_request
  Agent responds, logs interaction, confidence at 65%

Week 3:
  Crew: "grab me 10 lag bolts"
  Router: confidence at 78% — same pattern as "grab me"
  
Week 6:
  Crew: "grab me 5 tubes of caulk"
  Router: confidence at 94% — pattern confirmed across 47 interactions
  
Zero boss involvement. The router learns from confirmed interactions.
```

Signal: crew didn't follow up or clarify → conversation moved on naturally → classification was correct. Every successful interaction is a positive training signal.

**3 — Friday Learning Digest (single weekly touchpoint)**

```
Subject: Pearson & Pioneer — Material List + What I Learned

MATERIALS:
Pearson ✓ Mike (PVC 200ft, Copper 50ft, T-joints)
       ✗ Jose (no reply — nudged Thursday)
Pioneer ✓ Dave (Concrete anchors 20x, 3in pipe 100ft)

WHAT I LEARNED THIS WEEK:
• Pioneer concrete spec confirmed: 3000 PSI, 6" slump
• Added "DeWalt 12in miter saw" to equipment catalog
• Jose usually replies late Friday — overriding Thursday nudge for him

STILL UNCLEAR (if you have a minute):
• Does Pioneer need an inspection permit for the retaining wall?
  Dave asked but I don't have that info.
• What's our account number with Ferguson?
  Crew has asked twice this month.

You can just reply to this email — I'll take care of the rest.
```

One email. One optional section. The boss can ignore "still unclear" and the agent still works fine. If they reply, it gets smarter. Either way, no interruption.

**4 — Smart Escalation (only when it actually matters)**

```
Escalates to boss IMMEDIATELY:
  🔴 "Concrete saw smoking — safety issue at Pioneer"
  🔴 "Jose isn't responding and hasn't clocked in for 3 days"
  🔴 "Inspector showed up at Pearson asking about permits"
  🔴 "Injury reported — Joe fell at Pearson, conscious"

Goes in Friday digest (no urgency):
  🟡 "What's the Ferguson account number?"
  🟡 "Does Pioneer need a retaining wall permit?"
  🟡 "What's the spec for the new Highmark job?"
  
Handled silently (boss never sees):
  🟢 Crew confirms a spec
  🟢 Crew requests equipment reservation
  🟢 Crew reports minor issue already resolved
  🟢 Crew does a safety check-in
  🟢 Crew asks a question the agent can answer from knowledge base
```

Escalation is deterministic: `severity === 'critical' || category === 'safety' || category === 'compliance' || category === 'injury'`.

**5 — Invisible Context Injection (boss acts, agent learns)**

```
Boss forwards an email: "Pearson change order — copper pipe to PEX"

Agent:
  ├── Detects: change order pattern (from boss, not crew)
  ├── Updates: Pearson project spec (copper → PEX)
  ├── Logs: "Pearson pipe spec updated based on change order received 8/12"
  └── Does NOT reply. Doesn't acknowledge. Just does it.

Next time crew asks about Pearson pipe:
  "PEX tubing. Spec changed last week per the change order."
```

Boss never feels like they "trained the agent." They just forwarded an email — the same thing they'd do with any assistant. The agent handled the rest in the background.

### Confidence Tracking Per Company

Behind the scenes, we track confidence per intent pattern per company:

| Company | Intent | Pattern | Interactions | Confidence |
|---|---|---|---|---|
| Acme Plumbing | material_request | "grab me" | 47 | 94% |
| Acme Plumbing | material_request | "I could use" | 3 | 42% |
| Acme Plumbing | equipment_request | "I need the" + equip name | 28 | 88% |
| Acme Plumbing | knowledge_query | "what's the spec" | 12 | 91% |

The router self-improves. High confidence → auto-classify. Medium → classify but flag for review. Low → classify + note uncertainty in response. The boss only sees the fallback if the classification was visibly wrong.

### The Virtuous Cycle

```
Boss signs up
  → Crew starts using FieldReq
  → Agent makes best guesses, sometimes fuzzy
  → Boss forwards emails, texts context naturally
  → Knowledge base improves
  → Router confidence increases with volume
  → Agent gets demonstrably better every week
  → Crew trusts it more, uses it more
  → More interactions = more training data
  → Switching cost compounds
  → Boss tells other contractors: "This thing just gets smarter"
  → Churn approaches zero
```

---

## Context Injection — Boss Teaches the Agent by Talking

Instead of web forms, the boss teaches their agent via text, email, or photo.

### Text
```
Boss texts: "Pearson job: 4in Schedule 40 PVC, 20ft sticks.
Supplier is Ferguson. Joe is foreman. 1420 Main St."

→ ROUTER: context_injection (from boss number)
→ Tool: parse + embed into pgvector + update project record
→ LLM: "Got it. Pearson set up — 4in PVC spec saved, Ferguson as supplier,
  Joe assigned as foreman, address logged. Ready to go."
```

### Email
```
Boss forwards supplier quote to: pearson@fieldreq.app
→ Parsed → embedded → project context updated
```

### Photo
```
Boss texts a photo of a spec sheet
→ OCR → extracted text → embedded → searchable
```

Zero setup friction. Every interaction makes the agent more useful for that specific company.

---

## Equipment Tracking Module

### Native (all FieldReq accounts)

| Feature | How it works |
|---|---|
| Equipment **requests** | Crew texts "I need the plate compactor tomorrow at Pioneer" → reservation created |
| Equipment **checkout/return** | "Grabbing the hammer drill" → logged with timestamp |
| Equipment **issues** | "Concrete saw won't start" → logged, boss notified |
| Equipment **catalog** | Boss texts equipment names → stored in knowledge base |
| **Maintenance alerts** | Crew reports issue → ticket created → boss alerted |
| **Availability queries** | "Is the skid steer free tomorrow?" → checks reservations |

### BusyBusy Integration (premium tier, where available)

| BusyBusy Data | FieldReq SMS Query | Response |
|---|---|---|
| Equipment GPS | "Where's the excavator?" | "Excavator at Pearson, 1420 Main. Last seen 10 min ago." |
| Equipment hours | "Hours on the skid steer?" | "347 hours. Next service at 400." |
| Time cards | "Who's on Pearson today?" | "Joe (7:05 AM), Mike (7:22 AM), Dave (not checked in)" |
| Budget vs actual | "How we doing on Pearson?" | "12.5 hours used of 40 budgeted. On track." |
| Equipment assignments | "Hammer drill free tomorrow?" | "Currently at Pioneer. Finishes Friday." |

### Integration Tiers

| Tier | Who it's for | Equipment tracking |
|---|---|---|
| **FieldReq native** | All accounts | Equipment catalog, requests, issues, reservations |
| **BusyBusy integrated** | Companies on BusyBusy | Native + live GPS, hours, assignments from API |
| **Other platforms** | Procore, HCSS, etc. | Same pattern — pluggable integrations |

---

## AI Model — Shared + Dynamic Context Injection

No per-account provisioning. No training. One shared model, personalized per request.

```
Every SMS hits the same endpoint:

1. Twilio number → Company ID
2. DB lookup → crew member, project, active assignments
3. pgvector search → company's knowledge base (specs, protocols, supplier lists)
4. Recent messages → conversation context
5. System prompt assembled with ALL of the above
6. LLM responds with full company context
```

### What Gets Injected Per Request

| Source | What it provides |
|---|---|
| Company knowledge base (pgvector) | Project specs, pipe schedules, safety protocols, equipment lists, supplier info |
| Crew DB | Who's asking, which project they're on, what they've requested before |
| Projects DB | Active job sites, addresses, specs |
| Recent messages | Conversation context (what was just discussed) |
| BusyBusy (if connected) | Equipment GPS, hours, assignments |
| Equipment DB | Reservations, issues, availability |

### Knowledge Base Per Account

Companies upload (or text/email) their own documents → embedded into pgvector → searchable on every query:

- **Project specs** — "What pipe size for the Pearson job?"
- **Safety protocols** — "What's the fall protection rule?"
- **Equipment catalogs** — "Do we stock 3in copper elbows?"
- **Supplier lists** — "Who do we order PVC from?"

Uploaded once, embedded once, queried on every SMS. Cost: ~$0.0001 per doc to embed.

---

## Database Schema

### `profiles`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | FK → `auth.users.id` |
| `company_name` | text | |
| `phone` | text | Boss cell |
| `twilio_phone` | text | Provisioned Twilio number |
| `twilio_phone_sid` | text | Twilio resource ID for release |
| `trial_started_at` | timestamptz | |
| `trial_ends_at` | timestamptz | 7 days after start |
| `status` | enum | `trial`, `active`, `cancelled`, `paused` |
| `stripe_customer_id` | text | |
| `stripe_subscription_id` | text | |
| `busybusy_connected` | boolean | Integration flag |
| `busybusy_api_key` | text | Encrypted |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### `crew_members`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `profile_id` | uuid | FK → `profiles.id` |
| `name` | text | First name only |
| `phone` | text | E.164 format |
| `active` | boolean | Default true |
| `created_at` | timestamptz | |

### `projects`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `profile_id` | uuid | FK → `profiles.id` |
| `name` | text | e.g. "Pearson Elementary" |
| `address` | text | Job site address (optional) |
| `specs_embedded` | boolean | Whether specs have been embedded |
| `active` | boolean | Default true |
| `created_at` | timestamptz | |

### `project_assignments`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `project_id` | uuid | FK → `projects.id` |
| `crew_member_id` | uuid | FK → `crew_members.id` |
| `assigned_at` | timestamptz | |
| `unassigned_at` | timestamptz | Null if still active |

### `check_ins`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `profile_id` | uuid | FK → `profiles.id` |
| `crew_member_id` | uuid | FK → `crew_members.id` |
| `project_id` | uuid | FK → `projects.id` |
| `intent` | text | e.g. `material_request`, `safety_checkin`, `equipment_request` |
| `twilio_sid` | text | Outbound message SID |
| `status` | enum | `sent`, `delivered`, `failed`, `responded` |
| `sent_at` | timestamptz | |
| `responded_at` | timestamptz | |

### `material_items`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `check_in_id` | uuid | FK → `check_ins.id` |
| `crew_member_id` | uuid | FK → `crew_members.id` |
| `project_id` | uuid | FK → `projects.id` |
| `raw_text` | text | Crew member's exact reply |
| `parsed_items` | jsonb | Structured material list |
| `created_at` | timestamptz | |

### `equipment`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `profile_id` | uuid | FK → `profiles.id` |
| `name` | text | e.g. "DeWalt Miter Saw", "CAT 320 Excavator" |
| `type` | text | e.g. "power_tool", "heavy_equipment", "vehicle" |
| `busybusy_id` | text | External equipment ID (if integrated) |
| `status` | enum | `available`, `checked_out`, `maintenance`, `retired` |
| `last_gps_lat` | float | From BusyBusy or manual |
| `last_gps_lng` | float | |
| `service_hours` | int | Current hours |
| `next_service_hours` | int | Alert threshold |
| `created_at` | timestamptz | |

### `equipment_reservations`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `equipment_id` | uuid | FK → `equipment.id` |
| `crew_member_id` | uuid | FK → `crew_members.id` |
| `project_id` | uuid | FK → `projects.id` |
| `reserved_date` | date | |
| `created_at` | timestamptz | |

### `equipment_issues`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `equipment_id` | uuid | FK → `equipment.id` |
| `crew_member_id` | uuid | FK → `crew_members.id` |
| `description` | text | Crew's report |
| `severity` | enum | `low`, `medium`, `critical` |
| `resolved_at` | timestamptz | |
| `created_at` | timestamptz | |

### `knowledge_chunks` (pgvector)
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `profile_id` | uuid | FK → `profiles.id` |
| `source_type` | enum | `text`, `email`, `photo`, `upload` |
| `content` | text | Chunk text |
| `embedding` | vector(768) | pgvector embedding |
| `metadata` | jsonb | Source, project, date, etc. |
| `created_at` | timestamptz | |

---

## Pages

| Route | Purpose | Auth |
|---|---|---|
| `/` | Landing page (done) | No |
| `/login` | Email input → magic link sent | No |
| `/auth/callback` | Magic link handler → redirect | No |
| `/dashboard` | This week's summary, outstanding replies, quick actions | Yes |
| `/crew` | Add/edit/remove crew members | Yes |
| `/projects` | Manage job sites + assign crew | Yes |
| `/equipment` | Equipment catalog, reservations, issues | Yes |
| `/knowledge` | Upload/view company knowledge base | Yes |
| `/history` | Past material lists by week | Yes |
| `/settings` | Company profile, billing, integrations, cancel | Yes |

---

## API Routes (Express on Vercel)

### Auth
- Handled by Supabase JS client cookies + middleware

### Twilio — SMS Core
| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/twilio/inbound` | Handle ALL crew SMS → router → tool → LLM → response |
| `POST` | `/api/check-ins/send-weekly` | Cron — send Thursday check-ins |
| `POST` | `/api/check-ins/nudge` | Cron — nudge non-responders |

### Crew
| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/crew` | List crew members |
| `POST` | `/api/crew` | Add crew member |
| `PATCH` | `/api/crew/:id` | Update crew member |
| `DELETE` | `/api/crew/:id` | Remove crew member |

### Projects
| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/projects` | List projects |
| `POST` | `/api/projects` | Create project |
| `PATCH` | `/api/projects/:id` | Update project |
| `DELETE` | `/api/projects/:id` | Remove project |
| `POST` | `/api/projects/:id/assign` | Assign crew to project |

### Equipment
| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/equipment` | List equipment catalog |
| `POST` | `/api/equipment` | Add equipment |
| `POST` | `/api/equipment/:id/reserve` | Reserve equipment |
| `POST` | `/api/equipment/:id/report` | Report issue |
| `POST` | `/api/equipment/sync-busybusy` | Pull BusyBusy data |

### Dashboard & Materials
| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/dashboard` | Weekly check-in status across all projects |
| `GET` | `/api/materials/:projectId` | Material list for a project |
| `GET` | `/api/history` | Past material/equipment lists |

### Knowledge Base
| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/knowledge/ingest` | Boss texts/emails context → embed |
| `GET` | `/api/knowledge` | List knowledge chunks |
| `DELETE` | `/api/knowledge/:id` | Remove chunk |

---

## SMS Flow (Core Engine)

### Weekly Cycle

```
Thursday 8:00 AM → Cron: send-weekly
  └── For each active project:
      └── For each assigned crew member:
          ├── Send SMS: "Hey [Name]. Materials needed for [Project] next week?"
          └── Record check_in (intent: material_request)

Thursday 8:00 PM → Cron: nudge
  └── For each unanswered check_in:
      └── Send: "Hey [Name], quick reminder — any materials for [Project]?"

Friday 6:00 AM → Cron: summary email
  └── Consolidated list: who replied, what they need, who to chase
```

### Inbound SMS — Deterministic Router

```
SMS arrives at company's Twilio number

1. TWILIO NUMBER → Company ID (DB lookup, instant)
2. CREW PHONE → Crew member (DB lookup)
   → If unknown sender: "Who is this? Ask your boss to add you."
3. INTENT CLASSIFICATION (keyword + pattern, NOT LLM)
   → See intent map above
4. EXECUTE TOOL
   → DB write, API call, or pgvector search
5. ASSEMBLE CONTEXT
   → Intent result + structured data + knowledge base results
6. LLM RESPONSE
   → Natural, helpful, company-aware reply
7. SEND SMS
   → Via Twilio
```

---

## Trial Flow

| Day | Event |
|---|---|
| 0 | Boss signs up → magic link → dashboard → adds crew + project → clicks "Start trial" → Twilio number provisioned → immediate check-in sent |
| 0-3 | Crew replies → material list populates → boss sees product working immediately |
| 4 (Thu) | Regular Thursday check-in goes out to all crew |
| 4 (Thu PM) | Non-responders auto-nudged |
| 5 (Fri AM) | Boss gets consolidated email |
| 7 | Trial ends → convert to $49/mo or pause (data retained 30 days) |

### Trial Limits
| Resource | Trial | Paid |
|---|---|---|
| Active projects | 1 | Unlimited |
| Crew members | 5 | Unlimited |
| Equipment catalog | Up to 10 items | Unlimited |
| Knowledge base | Up to 5 documents | Unlimited |
| SMS on crew side | Always free | Always free |
| Duration | 7 days | Ongoing |

### Trial Economics
| Item | Cost per trial (~3 days avg) |
|---|---|
| Twilio number (prorated) | ~$0.11 |
| Outbound SMS (~20 msgs) | ~$0.16 |
| Inbound SMS (~5 msgs) | ~$0.04 |
| Magic link email (Supabase) | Free (50/wk) |
| Summary email (Resend) | Free (100/day) |
| LLM API calls | ~$0.05 |
| **Total** | **~$0.36** |

---

## Build Phases

| Phase | What | Dependencies |
|---|---|---|
| **1 — Auth + Shell** | Supabase magic link, login page, callback handler, dashboard shell, protected route middleware | None |
| **2 — Crew & Projects** | DB migrations, CRUD API routes, crew + project management pages | Phase 1 |
| **3 — SMS Core** | Twilio number provisioning, outbound SMS, inbound webhook, deterministic router, intent classification | Phase 2 |
| **4 — Knowledge Base** | pgvector setup, document ingestion, context injection, email ingestion, OCR for photos | Phase 2 |
| **5 — Dashboard + Materials** | Dashboard view, material list display, history page, check-in status tracking | Phase 3 |
| **6 — Scheduling** | Cron jobs (Thursday check-ins, nudge, Friday email), Resend email templates | Phase 5 |
| **7 — Equipment Module** | Equipment catalog, reservations, issue reporting, checkout/return | Phase 2 |
| **8 — BusyBusy Integration** | API client, GPS sync, hours sync, equipment status bridge | Phase 7 |
| **9 — Billing** | Stripe integration, trial management, subscription lifecycle, cancel flow | Phase 1 |

---

## Future Modules (Same Engine)

All ride the same SMS → Router → Tool → LLM pipeline. Different intents, same architecture.

| Module | Check-in Prompt | Intent |
|---|---|---|
| **Safety check-ins** | "All clear on site?" | `safety_checkin` |
| **Time tracking** | "What job today? Hours?" | `time_entry` |
| **Daily reports** | "What'd you get done today?" | `status_update` |
| **Incident reports** | "Any issues today?" | `incident_report` |
| **Schedule confirmations** | "Confirm Pioneer High tomorrow?" | `confirmation` |
| **Supplier orders** | "Order more 4in PVC from Ferguson" | `supplier_order` |

---

## Moat

| Moat component | Why it's defensible |
|---|---|
| **Silent learning loop** | The agent gets smarter every week without the boss lifting a finger. After 6 months, their VA knows every spec, supplier, project layout, and crew pattern. Switching means training a new one from zero. No competitor can replicate years of learned context. |
| **Company knowledge base** | Every text/email/photo the boss naturally sends makes the agent more capable. Data accumulates passively — the boss never "uploads docs," they just do their job. Switching cost compounds with every forwarded email. |
| **Self-healing router confidence** | Intent classification improves with volume alone. No tuning, no training UI. The product literally gets better the more you use it — a positive feedback loop that makes churn approach zero. |
| **Deterministic tool router** | Intent classification in code, not LLM. Reliable, predictable, debuggable. Competitors who route via LLM will hallucinate actions. |
| **Zero data cross-contamination** | Five-layer isolation enforced in code. Enterprise-grade data security out of the box. |
| **BusyBusy integration** | FieldReq is the only AI SMS layer that talks to their equipment data. Sticky for BusyBusy shops (thousands of companies). |
| **No-crew-friction** | SMS-based. No apps. No logins. The crew experience is texting a phone number. Competitors building apps won't get crew adoption. |
| **Platform pluggability** | BusyBusy → Procore → HCSS → any API. FieldReq is the communication layer on top of whatever ops stack the company uses. |
| **Acquisition target** | If FieldReq owns the AI SMS layer for field crews — and every interaction makes it more entrenched — every construction software company (Procore, BusyBusy, HCSS, Autodesk) needs this. They build apps. We build the interface their crews actually use. It's not a feature they can bolt on — it's a compounding data moat. |

---

_Last updated: 2026-08-09_
