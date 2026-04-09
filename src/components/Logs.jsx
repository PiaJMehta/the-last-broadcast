import React, { useState, useRef } from 'react';

const Logs = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="max-w-7xl mx-auto py-20 px-10 font-mono min-h-screen text-green-500 selection:bg-green-500 selection:text-black">
      <h1 className="text-4xl font-black mb-8 border-b border-green-900 pb-2 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex items-center gap-4">
          <span>// SIGNAL_ARCHIVE_TRANSCRIPT</span>
          {/* THE HIDDEN PLAYER: Waveform Icon Trigger */}
          <div
            onClick={togglePlay}
            className={`cursor-pointer transition-colors duration-300 ${isPlaying ? 'text-red-600' : 'text-green-900 hover:text-green-500'
              }`}
            title="SIGNAL_ENCRYPTION_MODULE"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="2" y="8" width="2" height="8" rx="1" />
              <rect x="5" y="5" width="2" height="14" rx="1" />
              <rect x="8" y="2" width="2" height="20" rx="1" />
              <rect x="11" y="6" width="2" height="12" rx="1" />
              <rect x="14" y="9" width="2" height="6" rx="1" />
              <rect x="17" y="5" width="2" height="14" rx="1" />
              <rect x="20" y="8" width="2" height="8" rx="1" />
            </svg>
          </div>
        </div>
        <span className="text-sm font-normal opacity-40 tracking-widest">STATION_ID: ALPHA-09</span>
      </h1>

      <div className="space-y-6">
        {/* Terminal Logs: The Main Focus */}
        <div className="bg-green-500/5 border border-green-900/30 p-6 rounded-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500/10 animate-scan"></div>

          <div className="flex justify-between mb-6 text-[10px] uppercase tracking-widest opacity-30 font-bold">
            <span>Entry_ID</span>
            <span>Transmission_Data</span>
            <span>Health</span>
          </div>

          <div className="space-y-4 text-sm relative z-10">
            <div className="flex gap-4 border-l-2 border-green-900/30 pl-4 hover:border-green-500 transition-colors py-1">
              <span className="opacity-30 font-bold whitespace-nowrap">#001</span>
              <span className="flex-1 text-green-500/80">LINK_ESTABLISHED: ORBITAL_ARCHIVE_NODE_7</span>
              <span className="text-green-900 text-[10px]">[OK]</span>
            </div>

            <div className="flex gap-4 border-l-2 border-green-900/30 pl-4 hover:border-green-500 transition-colors py-1">
              <span className="opacity-30 font-bold whitespace-nowrap">#002</span>
              <span className="flex-1">PULLING RAW SPECTRAL DATA (STREAM_7G_RAW.WAV)...</span>
              <span className="text-green-900 text-[10px]">[BUSY]</span>
            </div>

            <div className="flex gap-4 border-l-2 border-green-900/30 pl-4 hover:border-green-500 transition-colors py-1">
              <span className="opacity-30 font-bold whitespace-nowrap">#003</span>
              <span className="flex-1 text-yellow-500/60 font-semibold italic">FRAGMENTATION DETECTED IN UPPER FREQUENCY BANDS</span>
              <span className="text-yellow-900 text-[10px]">[WARN]</span>
            </div>

            <div className="flex gap-4 border-l-2 border-red-900/50 pl-4 hover:border-red-500 transition-colors py-1 bg-red-500/5">
              <span className="opacity-30 font-bold whitespace-nowrap">#004</span>
              <span className="flex-1 text-red-500/80">DECRYPTION ERROR: DATA HIDDEN IN VISUAL SPECTRUM</span>
              <span className="text-red-900 text-[10px] font-bold">[FAIL]</span>
            </div>

            <div className="flex gap-4 border-l-2 border-green-900/30 pl-4 hover:border-green-500 transition-colors py-1">
              <span className="opacity-30 font-bold whitespace-nowrap">#005</span>
              <span className="flex-1 opacity-50">MANUAL SPECTROGRAPHIC ANALYSIS REQUIRED FOR PAYLOAD</span>
              <span className="text-green-900 text-[10px]">[WAIT]</span>
            </div>
          </div>

          {/* Discreet signal bars that only move when playing */}
          <div className="mt-10 pt-4 border-t border-green-900/20 flex items-center gap-6">
            <div className="text-[10px] opacity-30 tracking-[0.3em] font-bold">SIGNAL_ANALYTICS:</div>
            <div className="flex gap-[2px] h-4 items-end flex-1 max-w-[200px]">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 transition-all duration-200 ${isPlaying ? 'bg-green-500/50' : 'bg-green-900/20'}`}
                  style={{
                    height: isPlaying ? `${Math.random() * 100}%` : '10%'
                  }}
                ></div>
              ))}
            </div>
            <div className="text-[10px] opacity-30 ml-auto italic">
              {isPlaying ? "STREAMING_RAW_DATA..." : "NODE_STANDBY"}
            </div>
          </div>
        </div>

        {/* The "Hidden" Audio Element */}
        <audio
          ref={audioRef}
          src="/signals/intercepted_signal.wav"
          preload="auto"
          onEnded={() => setIsPlaying(false)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-green-900/20 bg-green-900/5 text-xs italic opacity-40 leading-relaxed border-l-4">
            <p>
              "The spectrum doesn't lie. What you hear as noise, the eye sees as architecture.
              Download the stream. Some signals are meant to be seen, not heard."
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full ml-2 transition-colors duration-200 ${isPlaying
                  ? 'bg-red-600'
                  : 'bg-green-900'
                  }`}
              ></span>
            </p>
          </div>
          <div className="p-4 border border-green-900/20 bg-green-900/5 text-[10px] opacity-20 uppercase tracking-widest flex flex-col justify-center">
            <span>[ SYSTEM_MD5: 8f2b1d... ]</span>
            <span>[ ENCODING: BI-PHASE_L ]</span>
            <span>[ MODE: STEGANO_SPECTRAL ]</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logs;