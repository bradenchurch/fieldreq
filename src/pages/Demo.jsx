import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Demo() {
  const [data, setData] = useState({ checkIns: [], responses: [], crew: [] });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/check-in/responses');
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error("Failed to fetch data", e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const triggerCheckIn = async () => {
    setLoading(true);
    setStatus('Sending check-ins...');
    try {
      const res = await fetch('/api/check-in/send', { method: 'POST' });
      const json = await res.json();
      setStatus(`Sent check-in to ${json.sent} crew members.`);
      fetchData();
    } catch (e) {
      setStatus('Failed to send check-ins.');
    }
    setLoading(false);
  };

  return (
    <div className="font-sans min-h-screen bg-gray-50 text-gray-900 pb-12">
      <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-10 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-[#1e4b8c]">FieldReq Demo</h1>
        <Link to="/demo/summary" className="text-sm font-semibold text-gray-600 hover:text-black border border-gray-300 rounded-lg px-3 py-1.5 transition-colors">
          View Summary
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-8 space-y-8">
        
        {/* Controls */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold mb-1">Simulate Thursday Afternoon</h2>
            <p className="text-sm text-gray-500 max-w-sm">
              Send the automated check-in SMS to all active crew members on Pearson Elementary.
            </p>
          </div>
          <div className="text-center md:text-right shrink-0">
            <button 
              onClick={triggerCheckIn} 
              disabled={loading}
              className="bg-[#1e4b8c] text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-[#163d73] transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? 'Sending...' : 'Start Check-in'}
            </button>
            {status && <div className="text-xs text-gray-500 mt-2">{status}</div>}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Crew Status */}
          <section className="md:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Crew Status</h2>
            <div className="space-y-3">
              {data.crew && data.crew.map((member, i) => {
                const hasSent = data.checkIns.some(c => c.details.some(d => d.phone === member.phone));
                const hasReplied = data.responses.some(r => r.phone === member.phone);
                
                let colorClass = 'bg-gray-200';
                if (hasReplied) colorClass = 'bg-green-500';
                else if (hasSent) colorClass = 'bg-yellow-400';

                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${colorClass}`}></div>
                    <span className="text-sm font-medium">{member.name}</span>
                    <span className="text-xs text-gray-400 ml-auto">{member.preferred_language === 'es' ? '🇪🇸' : '🇺🇸'}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 space-y-1">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-200"></div> Not contacted</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-400"></div> Awaiting reply</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Replied</div>
            </div>
          </section>

          {/* Live Responses Feed */}
          <section className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[500px]">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Live SMS Feed</h2>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs text-gray-400">Polling active</span>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
              {data.responses.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                  Waiting for SMS responses...
                </div>
              ) : (
                data.responses.map((resp, i) => (
                  <div key={i} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm animate-fade-in-up">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-sm flex items-center gap-2">
                        {resp.name}
                        {resp.language === 'es' && <span title="Spanish Detected">🇲🇽</span>}
                        {resp.isMaterialReq && <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">MATERIAL</span>}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(resp.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                    <div className="text-gray-700 text-sm">{resp.message}</div>
                    <div className="mt-2 text-xs text-gray-400 font-medium">{resp.project}</div>
                  </div>
                )).reverse()
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
