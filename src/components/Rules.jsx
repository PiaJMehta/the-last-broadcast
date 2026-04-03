import React from 'react';

const Rules = () => {
  const ruleSet = [
    { id: "01", title: "THE DECODE", desc: "Extract clues hidden within source code and metadata." },
    { id: "02", title: "THE BUILD", desc: "Implement all discovered features into your interface." },
    { id: "03", title: "TIME LIMIT", desc: "3 hours. Late deployments result in signal termination." },
    { id: "04", title: "HINT TAX", desc: "Hints deduct points based on the clue difficulty level." }
  ];

  return (
    <div className="max-w-7xl mx-auto py-10 px-10 font-mono">
      <h1 className="text-4xl font-black mb-8 border-b border-green-500 pb-2">
        // PROTOCOL_RULES.LOG
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {ruleSet.map((rule) => (
          <div key={rule.id} className="border border-green-900 p-4 bg-green-500/5 hover:bg-green-500/10 transition-colors flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] bg-green-500 text-black px-1 font-bold tracking-tighter">RULE_{rule.id}</span>
                <span className="text-green-800 text-[8px] hidden lg:inline">STATUS: OK</span>
              </div>
              <h3 className="text-sm font-bold mb-2 text-white leading-tight">{rule.title}</h3>
              <p className="text-[10px] opacity-70 leading-snug italic">{rule.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 border border-red-900 bg-red-900/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-left">
          <h4 className="text-red-500 text-xs font-bold mb-1">// SCORING_ALGORITHM_ACTIVE</h4>
          <p className="text-[10px] opacity-60 italic">CREATIVITY & UI CONSISTENCY ARE WEIGHTED HEAVILY</p>
        </div>
        
      </div>
    </div>
  );
};

export default Rules;