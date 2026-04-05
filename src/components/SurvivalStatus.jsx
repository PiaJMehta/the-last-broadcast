import React from 'react';

const SurvivalStatus = () => {
  const sectors = [
    { name: "OXYGEN_GEN", level: 88, status: "STABLE" },
    { name: "POWER_GRID", level: 12, status: "CRITICAL" }, // CLUE: Why is this 12?
    { name: "COMMS_ARRAY", level: 45, status: "DEGRADED" },
    { name: "WATER_FILT", level: 92, status: "OPTIMAL" },
  ];

  return (
    <div className="border border-green-900 p-4 bg-black/40 font-mono text-[10px]">
      <h3 className="text-green-500 font-bold mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-red-600 animate-ping"></span> // VAULT_LIFE_SUPPORT
      </h3>
      
      <div className="space-y-4">
        {sectors.map((s) => (
          <div key={s.name}>
            <div className="flex justify-between mb-1">
              <span>{s.name}</span>
              <span className={s.level < 20 ? "text-red-500 animate-pulse" : "text-green-500"}>
                {s.level}%
              </span>
            </div>
            <div className="w-full bg-green-900/20 h-1.5 border border-green-900/30">
              <div 
                className={`h-full transition-all duration-1000 ${s.level < 20 ? 'bg-red-600' : 'bg-green-500'}`}
                style={{ width: `${s.level}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-green-900/30 opacity-40 italic">
        CAUTION: LOW VOLTAGE DETECTED IN SECTOR_7G. 
      </div>
    </div>
  );
};

export default SurvivalStatus;