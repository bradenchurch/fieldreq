import React from 'react';

export default function App() {
  return (
    <div className="font-sans text-[#1a1d23] bg-[#f4f5f7] antialiased">
      {/* Hero */}
      <section className="pt-[40px] md:pt-[80px] bg-gradient-to-b from-[#f4f5f7] to-[#e8eaef]">
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-[36px] md:gap-[60px] items-center text-center md:text-left">
          {/* Left Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#dce6f2] text-[#1e4b8c] text-[13px] font-bold px-[14px] py-[6px] rounded-[20px] mb-5">
              <span className="w-[7px] h-[7px] rounded-full bg-[#1e4b8c]"></span> Now available
            </div>
            <h1 className="text-[clamp(34px,4vw,48px)] font-[800] tracking-[-0.03em] leading-[1.08] mb-4 text-[#1a1d23]">
              Never chase a<br />material list again
            </h1>
            <p className="text-[clamp(16px,1.5vw,18px)] text-[#5a5f6b] max-w-[460px] leading-[1.55] mb-7 mx-auto md:mx-0">
              FieldReq texts your crew, collects what they need, and sends you one list Friday morning. No apps to install. No logins to remember.
            </p>
            <div className="flex gap-3 flex-wrap justify-center md:justify-start">
              <button className="inline-flex items-center justify-center px-7 py-[15px] rounded-xl text-[16px] font-semibold min-h-[48px] transition-all duration-150 bg-[#1e4b8c] text-white hover:bg-[#163d73] hover:-translate-y-[1px] border-none cursor-pointer">
                Start Free Trial
              </button>
              <button className="inline-flex items-center justify-center px-7 py-[15px] rounded-xl text-[16px] font-semibold min-h-[48px] transition-all duration-150 bg-transparent border-2 border-[#c4c9d2] text-[#1a1d23] hover:border-[#1e4b8c] cursor-pointer">
                See How It Works
              </button>
            </div>
          </div>
          
          {/* Right Illustrations */}
          <div className="text-center">
            <div className="flex gap-6 justify-center flex-wrap items-start">
              {/* Crew phone */}
              <div className="text-center">
                <div className="text-[11px] font-bold text-[#8c919b] mb-[10px] tracking-[0.04em]">YOUR CREW SEES THIS</div>
                
                {/* iPhone mockup */}
                <div className="w-[220px] bg-[#1a1d23] rounded-[32px] pt-[10px] pb-2 px-1.5 relative shadow-[0_20px_50px_rgba(0,0,0,0.18)] mx-auto">
                  {/* Notch */}
                  <div className="w-[80px] h-[18px] bg-[#1a1d23] rounded-b-[14px] absolute top-[10px] left-1/2 -translate-x-1/2 z-10"></div>
                  
                  {/* Screen */}
                  <div className="bg-[#eef0f3] rounded-[22px] overflow-hidden min-h-[340px] md:min-h-[420px] flex flex-col">
                    {/* Status bar */}
                    <div className="pt-[14px] px-[18px] pb-1.5 flex justify-between items-center text-[9px] font-semibold text-black bg-white">
                      <span>9:41</span>
                      <div className="flex gap-1 items-center">
                        <svg width="12" height="8" viewBox="0 0 12 8"><rect x="0" y="5" width="2" height="3" rx="0.5" fill="#000"/><rect x="3" y="4" width="2" height="4" rx="0.5" fill="#000"/><rect x="6" y="2" width="2" height="6" rx="0.5" fill="#000"/><rect x="9" y="0" width="2" height="8" rx="0.5" fill="#000"/></svg>
                        <span>5G</span>
                        <svg width="18" height="8" viewBox="0 0 18 8"><rect x="0" y="0" width="14" height="8" rx="2" stroke="#000" strokeWidth="1.5" fill="none"/><rect x="2" y="1.5" width="9" height="5" rx="1" fill="#000"/></svg>
                      </div>
                    </div>
                    
                    {/* iMessage header */}
                    <div className="bg-[#f6f6f6] py-1.5 px-[14px] flex items-center gap-2 border-b border-[#d5d9df]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                      <div className="flex-1 text-center text-[12px] font-semibold text-[#6b7280]">FieldReq</div>
                      <div className="w-4"></div>
                    </div>
                    
                    {/* Messages */}
                    <div className="p-[10px] pb-0 flex-1 flex flex-col bg-white">
                      <div className="text-center text-[9px] text-[#8e8e93] mb-2">Thursday 3:02 PM</div>
                      <div className="max-w-[85%] mb-1.5">
                        <div className="bg-[#e9e9eb] text-black rounded-[16px_16px_16px_4px] py-[10px] px-[14px] text-[13px] leading-[1.45] text-left">
                          Hey Mike. Materials needed for Pearson next week?
                        </div>
                      </div>
                      <div className="max-w-[85%] mb-1 ml-auto">
                        <div className="bg-[#1e4b8c] text-white rounded-[16px_16px_4px_16px] py-[10px] px-[14px] text-[13px] leading-[1.45] text-left">
                          4in PVC 200ft, 2in copper 50ft, 10x T-joints
                        </div>
                      </div>
                      <div className="text-right text-[10px] text-[#8c919b] mb-2 pr-1.5 mt-1">3:15 PM</div>
                      <div className="max-w-[85%] mb-3">
                        <div className="bg-[#e9e9eb] text-black rounded-[16px_16px_16px_4px] py-[10px] px-[14px] text-[13px] leading-[1.45] text-left">
                          Got it. Added to Pearson 👍
                        </div>
                      </div>
                    </div>
                    
                    {/* Input bar */}
                    <div className="border-t border-[#d1d1d4] py-1.5 px-[10px] flex items-center gap-1.5 bg-[#fafafa]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#8e8e93"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4" fill="#fff"/></svg>
                      <div className="flex-1 border border-[#d1d1d4] rounded-[16px] py-1.5 px-[10px] text-[10px] text-[#c7c7cc] text-left">iMessage</div>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#007AFF"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
                    </div>
                    
                    {/* Home indicator */}
                    <div className="pt-2 pb-1 flex justify-center bg-[#fafafa]">
                      <div className="w-[80px] h-1 bg-black rounded-full opacity-20"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Boss email */}
              <div className="text-center">
                <div className="text-[11px] font-bold text-[#8c919b] mb-[10px] tracking-[0.04em]">YOU GET THIS</div>
                <div className="w-full max-w-[300px] bg-white rounded-2xl py-[22px] px-5 text-left text-[13px] border border-[#e5e7ec] shadow-[0_8px_24px_rgba(0,0,0,0.06)] mx-auto">
                  <div className="font-bold text-[#1a1d23] mb-2">Material List — Aug 8</div>
                  <div className="text-[#1e4b8c] font-bold mb-1.5">Pearson Elementary</div>
                  <div className="mb-1">Mike ✓ PVC 200ft, Copper 50ft, 10x T-joints</div>
                  <div className="mb-3 text-[#b05a2a]">Jose ⊙ no reply yet</div>
                  <div className="text-[#1e4b8c] font-bold mb-1.5">Pioneer High</div>
                  <div>Dave ✓ Concrete anchors 20x, 3in pipe 100ft</div>
                  <div className="mt-3.5 pt-2.5 border-t border-[#e5e7ec] text-[11px] text-[#8c919b]">
                    Sent by FieldReq · taylor@plumbing.co
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After */}
      <section className="py-[80px] bg-white">
        <h2 className="text-center text-[clamp(26px,3vw,34px)] font-[800] mb-[48px] tracking-[-0.02em] text-[#1a1d23]">What actually changes</h2>
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-[32px]">
          <div className="rounded-2xl p-[36px] bg-[#f7f3f2] border border-[#e5dcd6]">
            <div className="text-[12px] font-[800] uppercase tracking-[0.06em] mb-3 text-[#b05a2a]">Without FieldReq</div>
            <h3 className="text-[20px] font-[700] mb-4">Friday is chaos</h3>
            <ul className="list-none">
              <li className="py-[6px] text-[15px] text-[#4a4d55] flex items-start gap-[10px]">
                <svg className="w-4 h-4 shrink-0 mt-[3px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#b05a2a" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                <span>Text 20 guys individually</span>
              </li>
              <li className="py-[6px] text-[15px] text-[#4a4d55] flex items-start gap-[10px]">
                <svg className="w-4 h-4 shrink-0 mt-[3px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#b05a2a" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                <span>Wait hours for half to reply</span>
              </li>
              <li className="py-[6px] text-[15px] text-[#4a4d55] flex items-start gap-[10px]">
                <svg className="w-4 h-4 shrink-0 mt-[3px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#b05a2a" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                <span>Someone forgot, now Monday's crew is idle</span>
              </li>
              <li className="py-[6px] text-[15px] text-[#4a4d55] flex items-start gap-[10px]">
                <svg className="w-4 h-4 shrink-0 mt-[3px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#b05a2a" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                <span>Consolidate seven different text threads</span>
              </li>
              <li className="py-[6px] text-[15px] text-[#4a4d55] flex items-start gap-[10px]">
                <svg className="w-4 h-4 shrink-0 mt-[3px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#b05a2a" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                <span>Repeat every single week</span>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl p-[36px] bg-[#ecf0f5] border border-[#cdd8e6]">
            <div className="text-[12px] font-[800] uppercase tracking-[0.06em] mb-3 text-[#1e4b8c]">With FieldReq</div>
            <h3 className="text-[20px] font-[700] mb-4">Friday just works</h3>
            <ul className="list-none">
              <li className="py-[6px] text-[15px] text-[#4a4d55] flex items-start gap-[10px]">
                <svg className="w-4 h-4 shrink-0 mt-[3px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1e4b8c" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Your crew was already texted Thursday</span>
              </li>
              <li className="py-[6px] text-[15px] text-[#4a4d55] flex items-start gap-[10px]">
                <svg className="w-4 h-4 shrink-0 mt-[3px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1e4b8c" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Non-responders got nudged Friday morning</span>
              </li>
              <li className="py-[6px] text-[15px] text-[#4a4d55] flex items-start gap-[10px]">
                <svg className="w-4 h-4 shrink-0 mt-[3px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1e4b8c" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>One email with everything by project</span>
              </li>
              <li className="py-[6px] text-[15px] text-[#4a4d55] flex items-start gap-[10px]">
                <svg className="w-4 h-4 shrink-0 mt-[3px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1e4b8c" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Place your order in under a minute</span>
              </li>
              <li className="py-[6px] text-[15px] text-[#4a4d55] flex items-start gap-[10px]">
                <svg className="w-4 h-4 shrink-0 mt-[3px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1e4b8c" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>That's it. You're done.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-[1100px] mx-auto py-[80px] px-6 bg-[#f4f5f7]">
        <h2 className="text-center text-[clamp(26px,3vw,34px)] font-[800] mb-[48px] tracking-[-0.02em] text-[#1a1d23]">Three steps. Zero apps.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] max-w-[360px] md:max-w-none mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-[56px] h-[56px] rounded-full bg-[#dce6f2] mb-4">
              <svg className="w-6 h-6 stroke-[#1e4b8c]" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3 className="text-[17px] font-[700] mb-1.5 text-[#1a1d23]">Add your crew</h3>
            <p className="text-[14px] text-[#5a5f6b] max-w-[260px] mx-auto">Text us names and numbers. One time. That's it.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-[56px] h-[56px] rounded-full bg-[#dce6f2] mb-4">
              <svg className="w-6 h-6 stroke-[#1e4b8c]" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <h3 className="text-[17px] font-[700] mb-1.5 text-[#1a1d23]">We text them Thursday</h3>
            <p className="text-[14px] text-[#5a5f6b] max-w-[260px] mx-auto">Every worker gets a guided check-in. They reply with what they need.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-[56px] h-[56px] rounded-full bg-[#dce6f2] mb-4">
              <svg className="w-6 h-6 stroke-[#1e4b8c]" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <h3 className="text-[17px] font-[700] mb-1.5 text-[#1a1d23]">Friday: one clean list</h3>
            <p className="text-[14px] text-[#5a5f6b] max-w-[260px] mx-auto">Who replied, what they need, who to chase. Place your order and move on.</p>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-[#1a1d23] py-[80px] px-6 text-center">
        <div className="max-w-[680px] mx-auto p-[40px] rounded-[14px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)]">
          <p className="text-[18px] text-[rgba(255,255,255,0.8)] italic leading-[1.6]">
            "I was spending Friday mornings texting 15 guys for material lists. Now I open one email and order. It just works."
          </p>
          <p className="mt-[16px] text-[14px] text-[rgba(255,255,255,0.5)] font-[600] not-italic">
            Taylor B. — Commercial Plumbing, 25-person crew
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-[1100px] mx-auto py-[80px] px-6 text-center bg-white border-t border-[#e5e7ec]">
        <h2 className="text-[clamp(26px,3vw,34px)] font-[800] mb-[36px] tracking-[-0.02em] text-[#1a1d23]">One price. No surprises.</h2>
        <div className="bg-[#1a1d23] text-white rounded-[20px] p-[48px] max-w-[420px] mx-auto">
          <div className="text-[52px] font-[800] tracking-[-0.03em] mb-1">
            $29<span className="text-[20px] font-normal opacity-50">/mo</span>
          </div>
          <div className="text-[#6b9bd2] font-[600] text-[15px] mb-[28px]">Free 7-day trial &middot; no setup fees</div>
          <ul className="list-none text-left max-w-[260px] mx-auto mb-[28px]">
            <li className="py-[6px] text-[14px] text-[rgba(255,255,255,0.7)] flex gap-1">
              <span className="text-[#6b9bd2] whitespace-pre">→ </span> Unlimited projects and workers
            </li>
            <li className="py-[6px] text-[14px] text-[rgba(255,255,255,0.7)] flex gap-1">
              <span className="text-[#6b9bd2] whitespace-pre">→ </span> Weekly automated outreach every Thursday
            </li>
            <li className="py-[6px] text-[14px] text-[rgba(255,255,255,0.7)] flex gap-1">
              <span className="text-[#6b9bd2] whitespace-pre">→ </span> Friday email summaries by project
            </li>
            <li className="py-[6px] text-[14px] text-[rgba(255,255,255,0.7)] flex gap-1">
              <span className="text-[#6b9bd2] whitespace-pre">→ </span> Free SMS replies for your crew
            </li>
            <li className="py-[6px] text-[14px] text-[rgba(255,255,255,0.7)] flex gap-1">
              <span className="text-[#6b9bd2] whitespace-pre">→ </span> Cancel anytime
            </li>
          </ul>
          <button className="w-full inline-flex items-center justify-center px-7 py-[15px] rounded-xl text-[16px] font-semibold min-h-[48px] transition-all duration-150 bg-[#1e4b8c] text-white hover:bg-[#163d73] border-none cursor-pointer">
            Start Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-[32px] px-6 border-t border-[#e5e7ec] text-[#8c919b] text-[13px] bg-[#f4f5f7]">
        FieldReq &middot; Built for the field
      </footer>
    </div>
  );
}
