import React from 'react';

const Resources = () => {
  const ciphers = [
    { id: "01", data: "im going to write the encoded msgs here"},
    { id: "02", data: "" },
    { id: "03", data: ""},
    { id: "04", data: "" },
    { id: "05", data: "" },
    { id: "06", data: ""},
    { id: "07", data: ""},
    { id: "08", data: "" },
    { id: "09", data: "" },
    { id: "10", data: ""}
  ];

  return (
    <div className="max-w-7xl mx-auto py-20 px-10 font-mono min-h-screen">
      <h1 className="text-4xl font-black mb-8 border-b border-green-500 pb-2">
        // SURVIVAL_RESOURCES.DB
      </h1>

      <p className="text-[10px] mb-8 opacity-50 uppercase tracking-[0.3em]">
        Warning: Accessing restricted database. Data packets may be corrupted.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ciphers.map((item) => (
          <div 
            key={item.id} 
            className="border border-green-900/50 p-4 bg-green-500/5 hover:bg-green-500/10 transition-all group"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-[9px] bg-green-900 text-green-400 px-2 py-0.5 font-bold">
                PACKET_{item.id}
              </span>
              
            </div>

            <div className="bg-black/40 p-3 border border-green-900/20 break-all">
              <code className="text-xs text-green-500 opacity-80 group-hover:opacity-100">
                {item.data}
              </code>
            </div>

          
          </div>
        ))}
      </div>

    </div>
  );
};

export default Resources;