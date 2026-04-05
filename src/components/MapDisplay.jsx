import React from 'react';

const MapDisplay = () => {
  return (
    <div className="relative w-full h-80 bg-[#050505] border border-green-900/50 overflow-hidden font-mono text-[10px] uppercase">
      
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1a472a_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <div 
        className="absolute inset-0 opacity-30 bg-center bg-no-repeat bg-contain filter brightness-150 contrast-125"
        style={{ 
          backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')`,
          filter: 'invert(48%) sepia(79%) font-family(53%) saturate(2878%) hue-rotate(91deg) brightness(118%) contrast(119%)'
        }}
      ></div>

      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="absolute w-[100px] h-[100px] border border-green-500/20 rounded-full"></div>
        <div className="absolute w-[250px] h-[250px] border border-green-500/10 rounded-full"></div>
        <div className="absolute w-[400px] h-[400px] border border-green-500/5 rounded-full"></div>
        
        <div className="absolute w-full h-px bg-green-500/20"></div>
        <div className="absolute w-px h-full bg-green-500/20"></div>
      </div>

      <div className="absolute top-4 left-4 z-20 space-y-1">
        <div className="bg-green-500 text-black px-1 font-black">AREA_SCAN: ACTIVE</div>
        <div className="text-green-500/60 font-bold opacity-80">LAT: 12.9234° N</div>
        <div className="text-green-500/60 font-bold opacity-80">LON: 77.5055° E</div>
      </div>

      <div className="absolute bottom-4 right-4 z-20 text-right">
        <p className="text-green-500 font-black">SURVIVOR_NODES: [UNKNOWN]</p>
        <p className="text-[8px] text-red-900 font-bold tracking-tighter mt-1">
          // SIGNAL_CARRIER_LOST
        </p>
      </div>

      <div className="absolute top-0 left-0 w-full h-1 bg-green-500/40 shadow-[0_0_15px_#22c55e] animate-scanVertical pointer-events-none"></div>

      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500"></div>
    </div>
  );
};

export default MapDisplay;