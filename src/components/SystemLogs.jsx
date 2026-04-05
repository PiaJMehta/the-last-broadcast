import React, { useState, useEffect } from 'react';

const SystemLogs = () => {
  const [logs, setLogs] = useState([
    "> INITIALIZING_BOOT_SEQUENCE...",
    "> LOADING_KERNEL_MODULES... DONE",
    "> SCANNING_FOR_SURVIVORS...",
    "> NO_SIGNAL_FOUND_IN_SECTOR_A"
  ]);

  const rawLogs = [
    "> INTRUSION_DETECTED_IN_PORT_8080",
    "> ERROR: CORRUPTED_DATA_PACKET_RECEIVED",
    "> DECRYPTING_SIGNAL_66.2...",
    "> PACKET_LOSS_78%",
    "> WARNING: THERMAL_OVERLOAD",
    "> BROADCAST_RELAY_OFFLINE",
    "> CLUE_FOUND: THE_VAULT_IS_OPEN"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const randomLog = rawLogs[Math.floor(Math.random() * rawLogs.length)];
      setLogs(prev => [...prev.slice(-5), randomLog]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="border border-green-900 p-4 bg-black/60 h-48 overflow-hidden font-mono text-[9px] leading-tight">
        <div className="text-green-500/30 mb-2">// REMOTE_CONSOLE_ACCESS</div>
        <div className="space-y-1">
          {logs.map((log, i) => (
            <div
              key={i}
              className={
                log.includes('WARNING') || log.includes('ERROR')
                  ? 'text-red-500'
                  : 'text-green-500'
              }
            >
              {log}
            </div>
          ))}
          <div className="w-2 h-4 bg-green-500 animate-pulse inline-block"></div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <h2 className="glitch text-green-400 text-sm tracking-widest">
          SIGNAL_CORRUPTION_DETECTED
        </h2>
      </div>
    </div>
  );
};

export default SystemLogs;