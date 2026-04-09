import React, { useEffect, useRef } from 'react';

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

const LOGS = [
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

export default function Logs() {
  const actxRef = useRef(null);
  const stateRef = useRef(
    [0, 1, 2, 3].map(() => ({
      playing: false,
      paused: false,
      spd: 1,
      tids: [],
      progressMs: 0,
      startWallMs: 0,
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

  function startMorse(idx, fromMs) {
    const st = stateRef.current[idx];
    const ac = gctx();
    const s = st.spd;
    clearTids(idx);
    st.startWallMs = Date.now() - fromMs;
    const acNow = ac.currentTime + 0.05;

    MORSE_EVENTS.forEach(e => {
      const scaledT = e.t / s;
      const fromScaled = fromMs / s;
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

  function startBlank(idx) {
    const st = stateRef.current[idx];
    clearTids(idx);
    st.startWallMs = Date.now();
    setFv(idx, '...', true);
    const dur = (3000 + Math.random() * 2000) / st.spd;
    const tid = setTimeout(() => stp(idx), dur);
    st.tids.push(tid);
  }

  function tog(idx) {
    const st = stateRef.current[idx];
    if (st.playing) {
      st.playing = false;
      st.paused = true;
      st.progressMs = (Date.now() - st.startWallMs) * st.spd;
      clearTids(idx);
      setBtn(idx, false);
      setFv(idx, '— paused —', false);
    } else {
      st.playing = true;
      st.paused = false;
      setBtn(idx, true);
      if (idx === 1) {
        const from = Math.min(st.progressMs, TOTAL_MS - 50);
        startMorse(idx, from);
      } else {
        startBlank(idx);
      }
    }
  }

  function stp(idx) {
    const st = stateRef.current[idx];
    st.playing = false;
    st.paused = false;
    st.progressMs = 0;
    st.startWallMs = 0;
    clearTids(idx);
    setBtn(idx, false);
    setFv(idx, '— standby —', false);
  }

  function updSpd(idx, val) {
    const st = stateRef.current[idx];
    const wasPlaying = st.playing;
    if (wasPlaying) {
      st.progressMs = (Date.now() - st.startWallMs) * st.spd;
      clearTids(idx);
    }
    st.spd = val;
    const el = document.getElementById(`spd${idx}`);
    if (el) el.textContent = val.toFixed(1) + 'x';
    if (wasPlaying) {
      if (idx === 1) {
        const from = Math.min(st.progressMs, TOTAL_MS - 50);
        startMorse(idx, from);
      } else {
        startBlank(idx);
      }
    }
  }

  useEffect(() => {
    return () => { [0, 1, 2, 3].forEach(i => clearTids(i)); };
  }, []);

  function Badge({ cls, label }) {
    const s = BADGE_STYLES[cls] || BADGE_STYLES.file;
    return (
      <span style={{
        fontSize: 9, padding: '2px 6px',
        border: `1px solid ${s.border}`, color: s.color,
        minWidth: 38, textAlign: 'center', flexShrink: 0, letterSpacing: 1,
      }}>{label}</span>
    );
  }

  function Player({ idx }) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '7px 10px', border: '1px solid #0d1f0d',
        background: '#070f07', flexWrap: 'wrap',
      }}>
        <button
          id={`pb${idx}`}
          onClick={() => tog(idx)}
          style={{
            background: 'transparent', border: '1px solid #1a4a1a',
            color: '#2a7a2a', width: 26, height: 26, cursor: 'crosshair',
            fontSize: 11, display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0,
          }}
        >▶</button>
        <button
          onClick={() => stp(idx)}
          style={{
            background: 'transparent', border: '1px solid #1a4a1a',
            color: '#2a7a2a', width: 26, height: 26, cursor: 'crosshair',
            fontSize: 9, display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0,
          }}
        >■</button>
        <span style={{ color: '#1a4a1a', fontSize: 9, letterSpacing: 2, flexShrink: 0 }}>FREQ</span>
        <input
          type="range" min="0.5" max="3" step="0.1" defaultValue="1"
          onChange={e => updSpd(idx, parseFloat(e.target.value))}
          style={{ width: 80, accentColor: '#1a5a1a', flexShrink: 0 }}
        />
        <span id={`spd${idx}`} style={{ color: '#1a4a1a', fontSize: 9, minWidth: 28, flexShrink: 0 }}>1.0x</span>
        <span
          id={`fv${idx}`}
          style={{
            color: '#1a3a1a', fontSize: 11, letterSpacing: 3,
            flex: 1, textAlign: 'right', minWidth: 80,
          }}
        >— standby —</span>
      </div>
    );
  }

  return (
    <div style={{ background: '#050505', padding: 24, fontFamily: "'Share Tech Mono', 'Courier New', monospace" }}>
      <div style={{
        color: '#39ff14', fontSize: 22, fontWeight: 500, letterSpacing: 3,
        borderBottom: '1px solid #1a3a1a', paddingBottom: 12, marginBottom: 20,
      }}>
        // SYSTEM_LOG_ARCHIVE.LOG
      </div>

      {LOGS.map((log, i) => (
        <div key={i} style={{ borderBottom: i < LOGS.length - 1 ? '1px solid #0d1f0d' : 'none' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: log.player !== undefined ? '10px 0 2px' : '10px 0',
            fontSize: 11,
          }}>
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
