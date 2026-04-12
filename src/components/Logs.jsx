import React, { useState, useRef, useEffect } from 'react';

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
          <div
            onClick={togglePlay}
            className={`cursor-pointer transition-colors duration-300 ${isPlaying ? 'text-red-600' : 'text-green-900 hover:text-green-500'}`}
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

          <div className="mt-10 pt-4 border-t border-green-900/20 flex items-center gap-6">
            <div className="text-[10px] opacity-30 tracking-[0.3em] font-bold">SIGNAL_ANALYTICS:</div>
            <div className="flex gap-[2px] h-4 items-end flex-1 max-w-[200px]">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 transition-all duration-200 ${isPlaying ? 'bg-green-500/50' : 'bg-green-900/20'}`}
                  style={{ height: isPlaying ? `${Math.random() * 100}%` : '10%' }}
                ></div>
              ))}
            </div>
            <div className="text-[10px] opacity-30 ml-auto italic">
              {isPlaying ? "STREAMING_RAW_DATA..." : "NODE_STANDBY"}
            </div>
          </div>
        </div>

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
              <span className={`inline-block w-2.5 h-2.5 rounded-full ml-2 transition-colors duration-200 ${isPlaying ? 'bg-red-600' : 'bg-green-900'}`}></span>
            </p>
          </div>
          <div className="p-4 border border-green-900/20 bg-green-900/5 text-[10px] opacity-20 uppercase tracking-widest flex flex-col justify-center">
            <span>[ SYSTEM_MD5: 8f2b1d... ]</span>
            <span>[ ENCODING: BI-PHASE_L ]</span>
            <span>[ MODE: STEGANO_SPECTRAL ]</span>
          </div>
        </div>
      </div>
      <MorseSection />
    </div>
  );
};

// ── MORSE SECTION ──────────────────────────────────────────────
const MC = {
  A:'.-',N:'-.',B:'-...',O:'---',C:'-.-.',P:'.--.',D:'-..',Q:'--.-',
  E:'.',R:'.-.',F:'..-.',S:'...',G:'--.',T:'-',H:'....',U:'..-',
  I:'..',V:'...-',J:'.---',W:'.--',K:'-.-',X:'-..-',L:'.-..',Y:'-.--',M:'--',Z:'--..'
};
const WORD = 'ANIMATE';
const DOT = 100, DASH = 300, SYM_GAP = 100, LETTER_GAP = 300;

function buildEvents() {
  const events = [];
  let t = 0;
  for (let li = 0; li < WORD.length; li++) {
    const syms = MC[WORD[li]].split('');
    events.push({ type: 'letter', li, sym: MC[WORD[li]], t });
    for (let si = 0; si < syms.length; si++) {
      const dur = syms[si] === '.' ? DOT : DASH;
      events.push({ type: 'beep', dur, t });
      t += dur + SYM_GAP;
    }
    t += LETTER_GAP - SYM_GAP;
  }
  events.push({ type: 'end', t });
  return events;
}

const MORSE_EVENTS = buildEvents();
const TOTAL_MS = MORSE_EVENTS[MORSE_EVENTS.length - 1].t;

const ARCHIVE_LOGS = [
  { time: '08:00', badge: 'SYS',  cls: 'sys',  msg: 'System boot successful',                                              size: '' },
  { time: '09:15', badge: 'RF',   cls: 'rf',   msg: 'Broadcast signal detected at 501.5 MHz',                             size: '3.1KB' },
  { time: '09:28', badge: 'WARN', cls: 'warn', msg: 'Checksum mismatch — node_cache_09.tmp — skipping',                   size: '3.1KB' },
  { time: '09:44', badge: 'FS',   cls: 'fs',   msg: 'index_rebuild.log — writing to /var/arc/idx',                        size: '1.9KB' },
  { time: '09:59', badge: 'FILE', cls: 'file', msg: 'arc_noise_001.dat — recovered from /arc/cache/raw — unverified',     size: '1.2KB', player: 0 },
  { time: '10:11', badge: 'ERR',  cls: 'err',  msg: 'Packet loss at relay_4 — retransmit failed x3',                      size: '' },
  { time: '10:29', badge: 'IO',   cls: 'io',   msg: 'sector_dump_B.bin — read complete',                                  size: '22.7KB' },
  { time: '10:42', badge: 'SYS',  cls: 'sys',  msg: 'Encrypted packet received: SECTOR_7G',                               size: '8.8KB' },
  { time: '10:58', badge: 'FILE', cls: 'file', msg: 'signal_burst_003.dat — recovered from /arc/cache/raw — unverified',  size: '2.4KB', player: 1 },
  { time: '11:03', badge: 'WARN', cls: 'warn', msg: 'Memory fragmentation at 71% — GC deferred',                          size: '' },
  { time: '11:19', badge: 'NET',  cls: 'net',  msg: 'relay_proxy_out.log — outbound routes blocked',                      size: '5.3KB' },
  { time: '11:31', badge: 'ERR',  cls: 'err',  msg: 'Uplink dropped — carrier lost — last ping 503ms',                    size: '' },
  { time: '11:48', badge: 'FILE', cls: 'file', msg: 'dead_channel_007.dat — recovered from /arc/cache/raw — unverified',  size: '9.8KB', player: 2 },
  { time: '12:05', badge: 'IO',   cls: 'io',   msg: 'arc_manifest_v2.bin — 8 entries found, 3 unreadable',                size: '9.8KB' },
  { time: '12:17', badge: 'FS',   cls: 'fs',   msg: 'backup_delta_03.log — write failed — disk quota exceeded',           size: '0.4KB' },
  { time: '12:33', badge: 'FILE', cls: 'file', msg: 'burst_remnant_B.dat — recovered from /arc/cache/raw — unverified',   size: '4.1KB', player: 3 },
  { time: '12:44', badge: 'WARN', cls: 'warn', msg: 'Thermal threshold exceeded — fan_ctrl_02 unresponsive',              size: '' },
  { time: '12:59', badge: 'RF',   cls: 'rf',   msg: 'Signal degradation — 501.5 MHz dropping to noise floor',             size: '1.7KB' },
];

const BADGE_STYLES = {
  rf:   { color: '#39ff14', border: '#39ff14' },
  warn: { color: '#ff6b00', border: '#ff6b00' },
  err:  { color: '#ff2a1f', border: '#ff2a1f' },
  fs:   { color: '#2a7a5a', border: '#2a7a5a' },
  io:   { color: '#2a5a7a', border: '#2a5a7a' },
  sys:  { color: '#39ff14', border: '#1a5a1a' },
  net:  { color: '#5a3a7a', border: '#3a2a5a' },
  file: { color: '#888',    border: '#444'    },
};

const NOISE_TYPE = { 0: 0, 2: 1, 3: 2 };

// ── MORSE PLAYER COMPONENT
function MorseSection() {
  const actxRef = useRef(null);
  const stateRef = useRef(
    [0, 1, 2, 3].map(() => ({
      playing: false, paused: false, spd: 1,
      tids: [], progressMs: 0, startWallMs: 0, noiseSource: null,
    }))
  );

  function gctx() {
    if (!actxRef.current)
      actxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return actxRef.current;
  }

  function beep(freq, durMs, ac, t) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.connect(g); g.connect(ac.destination);
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.35, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + durMs / 1000 - 0.015);
    o.start(t); o.stop(t + durMs / 1000);
  }

  function setFv(idx, text, active) {
    const el = document.getElementById(`fv${idx}`);
    if (el) { el.textContent = text; el.style.color = active ? '#39ff14' : '#1a3a1a'; }
  }

  function setBtn(idx, isPlaying) {
    const el = document.getElementById(`pb${idx}`);
    if (el) {
      el.textContent = isPlaying ? '⏸' : '▶';
      el.style.borderColor = isPlaying ? '#39ff14' : '#1a4a1a';
      el.style.color = isPlaying ? '#39ff14' : '#2a7a2a';
    }
  }

  function clearTids(idx) {
    stateRef.current[idx].tids.forEach(clearTimeout);
    stateRef.current[idx].tids = [];
  }

  function killNoise(idx) {
    const st = stateRef.current[idx];
    if (st.noiseSource) {
      try { st.noiseSource.stop(); } catch (e) {}
      st.noiseSource = null;
    }
  }

  function makeNoiseBuffer(ac, type) {
    const rate = ac.sampleRate, sz = rate * 3;
    const buf = ac.createBuffer(1, sz, rate);
    const d = buf.getChannelData(0);
    if (type === 0) {
      for (let i = 0; i < sz; i++) d[i] = Math.random() * 2 - 1;
    } else if (type === 1) {
      let last = 0;
      for (let i = 0; i < sz; i++) {
        last = last * 0.98 + (Math.random() * 2 - 1) * 0.02 + Math.sin(i * 0.02) * 0.3;
        d[i] = last + (Math.random() < 0.005 ? (Math.random() * 2 - 1) * 0.8 : 0);
      }
    } else {
      for (let i = 0; i < sz; i++)
        d[i] = (Math.random() * 2 - 1) * 0.5
          + Math.sin((i / rate) * 2200 * Math.PI * 2) * 0.3
          + Math.sin((i / rate) * 2800 * Math.PI * 2) * 0.15;
    }
    return buf;
  }

  function startBlank(idx) {
    const st = stateRef.current[idx];
    const ac = gctx();
    clearTids(idx); killNoise(idx);
    st.startWallMs = Date.now();
    setFv(idx, '...', true);
    const noiseType = NOISE_TYPE[idx] ?? 0;
    const src = ac.createBufferSource();
    src.buffer = makeNoiseBuffer(ac, noiseType);
    src.loop = true;
    const gain = ac.createGain();
    if (noiseType === 0) {
      const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 800; f.Q.value = 0.8;
      src.connect(f); f.connect(gain);
      gain.gain.setValueAtTime(0.15, ac.currentTime);
      gain.gain.setTargetAtTime(0.05, ac.currentTime + 0.3, 0.2);
      gain.gain.setTargetAtTime(0.18, ac.currentTime + 0.8, 0.15);
      gain.gain.setTargetAtTime(0.02, ac.currentTime + 1.4, 0.1);
    } else if (noiseType === 1) {
      const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 400;
      src.connect(f); f.connect(gain);
      gain.gain.setValueAtTime(0.25, ac.currentTime);
      gain.gain.setTargetAtTime(0.1, ac.currentTime + 0.5, 0.3);
      gain.gain.setTargetAtTime(0.3, ac.currentTime + 1.2, 0.2);
    } else {
      const f = ac.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1800;
      src.connect(f); f.connect(gain);
      gain.gain.setValueAtTime(0.1, ac.currentTime);
      gain.gain.setTargetAtTime(0.2, ac.currentTime + 0.2, 0.1);
      gain.gain.setTargetAtTime(0.05, ac.currentTime + 0.9, 0.2);
    }
    gain.connect(ac.destination);
    src.start();
    st.noiseSource = src;
    const dur = (2500 + Math.random() * 1500) / st.spd;
    const tid = setTimeout(() => stp(idx), dur);
    st.tids.push(tid);
  }

  function startMorse(idx, fromMs) {
    const st = stateRef.current[idx];
    const ac = gctx();
    const s = st.spd;
    clearTids(idx);
    st.startWallMs = Date.now() - fromMs;
    const acNow = ac.currentTime + 0.05;
    MORSE_EVENTS.forEach(e => {
      const scaledT = e.t / s, fromScaled = fromMs / s;
      if (scaledT < fromScaled) return;
      const relMs = scaledT - fromScaled;
      if (e.type === 'beep') {
        beep(600, e.dur / s, ac, acNow + relMs / 1000);
      } else if (e.type === 'letter') {
        const tid = setTimeout(() => {
          if (!stateRef.current[idx].playing) return;
          setFv(idx, e.sym, true);
        }, relMs);
        st.tids.push(tid);
      } else if (e.type === 'end') {
        const tid = setTimeout(() => {
          if (!stateRef.current[idx].playing) return;
          stp(idx);
        }, relMs + 200);
        st.tids.push(tid);
      }
    });
  }

  function tog(idx) {
    const st = stateRef.current[idx];
    if (st.playing) {
      st.playing = false; st.paused = true;
      st.progressMs = (Date.now() - st.startWallMs) * st.spd;
      killNoise(idx); clearTids(idx);
      setBtn(idx, false); setFv(idx, '— paused —', false);
    } else {
      st.playing = true; st.paused = false;
      setBtn(idx, true);
      if (idx === 1) { startMorse(idx, Math.min(st.progressMs, TOTAL_MS - 50)); }
      else { startBlank(idx); }
    }
  }

  function stp(idx) {
    const st = stateRef.current[idx];
    st.playing = false; st.paused = false; st.progressMs = 0; st.startWallMs = 0;
    killNoise(idx); clearTids(idx);
    setBtn(idx, false); setFv(idx, '— standby —', false);
  }

  function updSpd(idx, val) {
    const st = stateRef.current[idx];
    const wasPlaying = st.playing;
    if (wasPlaying) { st.progressMs = (Date.now() - st.startWallMs) * st.spd; killNoise(idx); clearTids(idx); }
    st.spd = val;
    const el = document.getElementById(`spd${idx}`);
    if (el) el.textContent = val.toFixed(1) + 'x';
    if (wasPlaying) {
      if (idx === 1) { startMorse(idx, Math.min(st.progressMs, TOTAL_MS - 50)); }
      else { startBlank(idx); }
    }
  }

  useEffect(() => {
    return () => { [0, 1, 2, 3].forEach(i => { clearTids(i); killNoise(i); }); };
  }, []);

  function Badge({ cls, label }) {
    const s = BADGE_STYLES[cls] || BADGE_STYLES.file;
    return (
      <span style={{ fontSize: 9, padding: '2px 6px', border: `1px solid ${s.border}`, color: s.color, minWidth: 38, textAlign: 'center', flexShrink: 0, letterSpacing: 1 }}>
        {label}
      </span>
    );
  }

  function Player({ idx }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', border: '1px solid #0d1f0d', background: '#070f07', flexWrap: 'wrap' }}>
        <button id={`pb${idx}`} onClick={() => tog(idx)} style={{ background: 'transparent', border: '1px solid #1a4a1a', color: '#2a7a2a', width: 26, height: 26, cursor: 'crosshair', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>▶</button>
        <button onClick={() => stp(idx)} style={{ background: 'transparent', border: '1px solid #1a4a1a', color: '#2a7a2a', width: 26, height: 26, cursor: 'crosshair', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>■</button>
        <span style={{ color: '#1a4a1a', fontSize: 9, letterSpacing: 2, flexShrink: 0 }}>FREQ</span>
        <input type="range" min="0.5" max="3" step="0.1" defaultValue="1" onChange={e => updSpd(idx, parseFloat(e.target.value))} style={{ width: 80, accentColor: '#1a5a1a', flexShrink: 0 }} />
        <span id={`spd${idx}`} style={{ color: '#1a4a1a', fontSize: 9, minWidth: 28, flexShrink: 0 }}>1.0x</span>
        <span id={`fv${idx}`} style={{ color: '#1a3a1a', fontSize: 11, letterSpacing: 3, flex: 1, textAlign: 'right', minWidth: 80 }}>— standby —</span>
      </div>
    );
  }

  return (
    <div style={{ background: '#050505', padding: 24, fontFamily: "'Share Tech Mono', 'Courier New', monospace", marginTop: 32 }}>
      <div style={{ color: '#39ff14', fontSize: 22, fontWeight: 500, letterSpacing: 3, borderBottom: '1px solid #1a3a1a', paddingBottom: 12, marginBottom: 20 }}>
        // SYSTEM_LOG_ARCHIVE.LOG
      </div>
      {ARCHIVE_LOGS.map((log, i) => (
        <div key={i} style={{ borderBottom: i < ARCHIVE_LOGS.length - 1 ? '1px solid #0d1f0d' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: log.player !== undefined ? '10px 0 2px' : '10px 0', fontSize: 11 }}>
            <span style={{ color: '#2a5a2a', minWidth: 52, flexShrink: 0 }}>[{log.time}]</span>
            <Badge cls={log.cls} label={log.badge} />
            <span style={{ color: '#3a6a3a', flex: 1 }}>{log.msg}</span>
            <span style={{ color: '#1a3a1a', fontSize: 9, minWidth: 36, textAlign: 'right', flexShrink: 0 }}>{log.size}</span>
          </div>
          {log.player !== undefined && <Player idx={log.player} />}
        </div>
      ))}
    </div>
  );
}

export default Logs;