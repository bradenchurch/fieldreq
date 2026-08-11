import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Summary() {
  const [data, setData] = useState({ checkIns: [], responses: [], crew: [] });

  useEffect(() => {
    fetch('/api/check-in/responses')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(console.error);
  }, []);

  const getMaterials = () => {
    return data.responses.filter(r => r.isMaterialReq);
  };

  const getNonResponders = () => {
    if (!data.crew) return [];
    return data.crew.filter(c => !data.responses.some(r => r.phone === c.phone));
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="font-sans min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-6">
        
        {/* Email Header Simulation */}
        <div className="bg-[#1e4b8c] text-white p-6 pb-8 text-center">
          <div className="text-sm font-semibold opacity-80 mb-1">Weekly Summary</div>
          <h1 className="text-2xl font-bold">Material List</h1>
          <div className="text-sm opacity-90 mt-1">{today}</div>
        </div>

        {/* Content */}
        <div className="p-6 -mt-4 bg-white rounded-t-xl">
          <h2 className="text-[#1e4b8c] font-bold text-lg mb-3 border-b border-gray-100 pb-2">
            {data.project || 'Pearson Elementary'}
          </h2>
          
          <div className="space-y-4">
            {getMaterials().map((resp, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 text-green-500 font-bold shrink-0">✓</div>
                <div>
                  <span className="font-semibold text-gray-900">{resp.name}</span>
                  <p className="text-gray-600 text-sm mt-0.5">{resp.message}</p>
                </div>
              </div>
            ))}
            
            {getMaterials().length === 0 && (
              <div className="text-gray-400 text-sm italic">No material requests yet.</div>
            )}

            {getNonResponders().length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                {getNonResponders().map((crew, i) => (
                  <div key={i} className="flex items-center gap-3 text-red-500">
                    <div className="font-bold shrink-0">⊙</div>
                    <span className="font-medium text-sm">{crew.name} <span className="opacity-70 font-normal">no reply yet</span></span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 border-t border-gray-100">
          Sent by FieldReq &middot; demo@fieldreq.com
        </div>
      </div>
      
      <Link to="/demo" className="text-[#1e4b8c] font-semibold hover:underline">
        ← Back to Demo Dashboard
      </Link>
    </div>
  );
}
