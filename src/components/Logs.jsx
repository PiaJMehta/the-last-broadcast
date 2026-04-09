import React from 'react';

const Logs = () => {
  return (
    <div className="max-w-7xl mx-auto py-20 px-10 font-mono min-h-screen">
      <h1 className="text-4xl font-black mb-8 border-b border-green-500 pb-2">
        // SYSTEM_LOG_ARCHIVE.LOG
      </h1>
      <div className="space-y-2 opacity-60">
        <p>[08:00] SYSTEM BOOT SUCCESSFUL</p>
        <p>[09:15] BROADCAST SIGNAL DETECTED AT 501.5 MHz</p>
        <p>[10:42] ENCRYPTED PACKET RECEIVED: SECTOR_7G</p>
      </div>
    </div>
  );
};

export default Logs;