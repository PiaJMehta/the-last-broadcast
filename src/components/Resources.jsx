import React from 'react';
const Resources = () => {
  const ciphers = [
    { id: "01", data: "r2^@Ih78shnk"},
    { id: "02", data: "8&^$%rrnbshuv" },
    { id: "03", data: "mnim nlqg?!"},
    { id: "04", data: "88r^!IY!" },
    { id: "05", data: "xnhtyexn" },
    { id: "06", data: "obu kcpo ghhlkxg"},
    { id: "07", data: "ib cE0FwUr3"},
    { id: "08", data: "ort lf j4qeRk" },
    { id: "09", data: "uaauci jnb wvxuptbfr" },
    { id: "10", data: "ea yhlv mrblzxu."},
    { id: "11", data: "bjs*&027sva"},
    { id: "12", data: "hshb7^*&%hv"},
  ];
  return (
    <div className="max-w-7xl mx-auto py-20 px-10 font-mono min-h-screen">
      <h1 className="text-4xl font-black mb-8 border-b border-green-500 pb-2">
        // SURVIVAL_RESOURCES.DB 
      </h1>
      <p className="text-[10px] mb-8 opacity-50 uppercase tracking-[0.3em]">
        Warning: Accessing restricted database. Data packets may be corrupted. 
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
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
      <p className="text-[10px] mt-8 mb-8 opacity-30 uppercase tracking-[0.3em]">
        dangerdangerdangerdangerdangerdangerdangerdangerdangerdangerdangerdangerdangerdangerdangerdangerdangerdangerdangerdangerdangerdangerdanger
      </p>
    </div>
  );
};
export default Resources;