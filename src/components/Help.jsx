import React, { useRef, useEffect, useCallback, useState } from 'react';

const GLITCH_CHARS  = '!@#$%^&*<>/?\\|█▓▒░╗╔╝╚═║';
const GLITCH_TARGET = 'IMPLEMENT → GLITCH TEXT ANIMATION :: FEATURE UNLOCKED';
const GLITCH_IDLE   = 'YOU CAN READ IT, IF YOU COULD JUST STAY STILL...';

const CLASSIFIED_RECORDS = [
  { key: 'OPERATOR',    val: '[REDACTED]', reveal: 'UNIT_7-ECHO'   },
  { key: 'ORIGIN_NODE', val: '[REDACTED]', reveal: 'NODE_44.7.119' },
  { key: 'AUTH_TOKEN',  val: '[REDACTED]', reveal: '0xF3A1-CC9D'   },
  { key: 'CODE.GUESS',    val: '[REDACTED]', reveal: '1-2-3-5-7-8-9'},
  { key: 'LAST_PING',   val: '[REDACTED]', reveal: '04:17:32 UTC'  },
  { key: 'PRIORITY',    val: '[REDACTED]', reveal: 'CRITICAL ⬛'   },
];

const LOG_POOL = [
  ['ok',   '[SYS] booting secure channel... done'],
  ['warn', '[NET] packet loss detected: 12.4%'],
  ['err',  '[ERR] authentication attempt #7 — FAILED'],
  ['ok',   '[SYS] memory scrub complete'],
  ['warn', '[NET] route table corrupted — rerouting'],
  ['err',  '[ERR] unknown process spawned at 0xF3A1'],
  ['ok',   '[SYS] watchdog timer reset'],
  ['warn', '[IO ] disk sector unreadable — skipping'],
  ['err',  '[ERR] intrusion detected on port 4444'],
  ['ok',   '[SYS] failsafe engaged'],
  ['warn', '[MEM] heap fragmentation 78%'],
  ['ok',   '[NET] tunnel established via proxy'],
  ['err',  '[ERR] signal origin obfuscated'],
  ['warn', '[SYS] clock drift: +2.3s'],
  ['ok',   '[SYS] environment restored'],
];

const BAR_HEIGHTS = [8, 12, 16, 20, 24];
const SIG_LEVELS = [
  { bars: 1, txt: 'SIGNAL CRITICAL', weak: true,  col: 'rgba(255,42,31,.55)'  },
  { bars: 2, txt: 'SIGNAL WEAK',     weak: true,  col: 'rgba(255,42,31,.55)'  },
  { bars: 3, txt: 'SIGNAL PARTIAL',  weak: false, col: 'rgba(229,160,0,.55)'  },
  { bars: 4, txt: 'SIGNAL STABLE',   weak: false, col: 'rgba(57,255,20,.5)'   },
  { bars: 5, txt: 'SIGNAL STRONG',   weak: false, col: 'rgba(57,255,20,.65)'  },
];

function SectionLabel({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
      <div style={{ width: 20, height: 1, background: 'rgba(57,255,20,.18)', flexShrink: 0 }} />
      <span style={{ fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(57,255,20,.28)', fontWeight: 400 }}>
        {children}
      </span>
    </div>
  );
}

function SignalBars({ level }) {
  const { bars, txt, weak, col } = SIG_LEVELS[level];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3 }}>
        {BAR_HEIGHTS.map((h, i) => (
          <div key={i} style={{ height: h, width: 6, borderRadius: 1, background: i < bars ? (weak ? '#ff2a1f' : '#39ff14') : '#1a1a1a' }} />
        ))}
      </div>
      <span style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: col }}>{txt}</span>
    </div>
  );
}

function UptimeTicker() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
  const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
  const s = String(elapsed % 60).padStart(2, '0');
  return (
    <span style={{ fontSize: 12, letterSpacing: '0.16em', fontVariantNumeric: 'tabular-nums', color: 'rgba(57,255,20,.7)', fontWeight: 500 }}>
      {h}:{m}:{s}
    </span>
  );
}

function RedactRow({ rec }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '14px 24px', borderBottom: '1px solid rgba(57,255,20,.05)' }}>
      <span style={{ minWidth: 148, flexShrink: 0, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(57,255,20,.32)' }}>
        {rec.key}
      </span>
      <span
        onClick={() => !revealed && setRevealed(true)}
        style={revealed
          ? { fontSize: 10, letterSpacing: '0.14em', background: 'transparent', color: '#39ff14', cursor: 'default', border: '1px solid transparent', padding: '3px 10px', borderRadius: 2, transition: 'all .15s' }
          : { fontSize: 10, letterSpacing: '0.14em', background: 'rgba(57,255,20,.05)', color: 'rgba(57,255,20,.05)', cursor: 'pointer', border: '1px solid rgba(57,255,20,.09)', padding: '3px 10px', borderRadius: 2, transition: 'all .15s' }
        }
        title={revealed ? undefined : 'Click to reveal'}
      >
        {revealed ? rec.reveal : rec.val}
      </span>
    </div>
  );
}

function TerminalLog() {
  const [entries, setEntries] = useState([]);
  const idxRef = useRef(0);
  const addEntry = useCallback(() => {
    const [type, msg] = LOG_POOL[idxRef.current % LOG_POOL.length];
    idxRef.current++;
    const ts = new Date().toISOString().slice(11, 19);
    setEntries(prev => [...prev.slice(-6), { type, text: `${ts}  ${msg}` }]);
  }, []);
  useEffect(() => {
    for (let i = 0; i < 4; i++) addEntry();
    const id = setInterval(addEntry, 1800);
    return () => clearInterval(id);
  }, [addEntry]);
  const COLOR = { ok: '#39ff14', warn: '#e5a000', err: '#ff2a1f' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#020202', border: '1px solid rgba(57,255,20,.08)', borderRadius: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 22px', borderBottom: '1px solid rgba(57,255,20,.06)', background: 'rgba(57,255,20,.02)' }}>
        {['#ff2a1f', '#e5a000', '#39ff14'].map((c, i) => (
          <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: 0.85 }} />
        ))}
        <span style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(57,255,20,.22)', marginLeft: 6 }}>
          SYSTEM.LOG — LIVE
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 7, padding: '18px 22px 20px', minHeight: 180 }}>
        {entries.map((e, i) => (
          <div key={i} style={{ fontSize: 10, lineHeight: 1.7, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '0.06em', color: COLOR[e.type], opacity: i === entries.length - 1 ? 1 : 0.5 }}>
            {e.text}
          </div>
        ))}
        <span style={{ display: 'inline-block', width: 7, height: 12, background: '#39ff14', marginLeft: 2, verticalAlign: 'middle', animation: 'blink .8s step-end infinite' }} />
      </div>
    </div>
  );
}

const Help = () => {
  const textRef            = useRef(null);
  const barRef             = useRef(null);
  const ctaRef             = useRef(null);
  const pctRef             = useRef(null);
  const blockRef           = useRef(null);
  const decodedRef         = useRef(false);
  const decodingRef        = useRef(false);
  const progressRef        = useRef(0);
  const decodeIntervalRef  = useRef(null);
  const passiveIntervalRef = useRef(null);
  const [sigLevel, setSigLevel] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setSigLevel(prev => Math.min(4, Math.max(0, prev + (Math.random() < 0.4 ? (Math.random() < 0.5 ? -1 : 1) : 0))));
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const glScramble = useCallback(prog =>
    GLITCH_TARGET.split('').map((c, i) => {
      if (c === ' ' || c === '→') return c;
      return prog >= i / GLITCH_TARGET.length ? c : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
    }).join(''), []);

  const glStartPassive = useCallback(() => {
    if (passiveIntervalRef.current) return;
    passiveIntervalRef.current = setInterval(() => {
      if (decodingRef.current || decodedRef.current || !textRef.current) return;
      textRef.current.textContent = GLITCH_IDLE.split('').map(c =>
        c !== ' ' && Math.random() < 0.07 ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] : c
      ).join('');
    }, 90);
  }, []);

  const glStartDecode = useCallback(() => {
    if (decodedRef.current) return;
    clearInterval(passiveIntervalRef.current);
    passiveIntervalRef.current = null;
    decodingRef.current = true;
    progressRef.current = 0;
    blockRef.current?.classList.add('gl-decoding');
    if (ctaRef.current) ctaRef.current.textContent = 'DECODING...';
    decodeIntervalRef.current = setInterval(() => {
      progressRef.current += 0.018;
      const pct = Math.min(100, Math.round(progressRef.current * 100));
      if (pctRef.current) pctRef.current.textContent = pct + '%';
      if (progressRef.current >= 1) {
        clearInterval(decodeIntervalRef.current);
        if (textRef.current)  textRef.current.textContent  = GLITCH_TARGET;
        if (barRef.current)   barRef.current.style.width   = '100%';
        if (pctRef.current)   pctRef.current.textContent   = '100%';
        blockRef.current?.classList.remove('gl-decoding');
        blockRef.current?.classList.add('gl-decoded');
        if (ctaRef.current) { ctaRef.current.textContent = '✓ TRANSMISSION RECOVERED'; ctaRef.current.dataset.success = 'true'; }
        decodedRef.current  = true;
        decodingRef.current = false;
        return;
      }
      if (textRef.current) textRef.current.textContent = glScramble(progressRef.current);
      if (barRef.current)  barRef.current.style.width  = (progressRef.current * 100) + '%';
    }, 40);
  }, [glScramble]);

  const glStopDecode = useCallback(() => {
    if (decodedRef.current) return;
    clearInterval(decodeIntervalRef.current);
    decodingRef.current = false;
    progressRef.current = 0;
    blockRef.current?.classList.remove('gl-decoding');
    if (barRef.current)  barRef.current.style.width   = '0%';
    if (pctRef.current)  pctRef.current.textContent   = '0%';
    if (textRef.current) textRef.current.textContent  = GLITCH_IDLE;
    if (ctaRef.current)  { ctaRef.current.textContent = '[ HOVER TO DECODE ]'; delete ctaRef.current.dataset.success; }
    glStartPassive();
  }, [glStartPassive]);

  useEffect(() => {
    glStartPassive();
    return () => { clearInterval(passiveIntervalRef.current); clearInterval(decodeIntervalRef.current); };
  }, [glStartPassive]);

  return (
    <div style={{ minHeight: '100vh', background: '#000', fontFamily: "'JetBrains Mono', 'Courier New', monospace", color: '#39ff14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '64px 32px 96px', boxSizing: 'border-box' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes scan  { 0% { transform: translateY(-100%); } 100% { transform: translateY(600%); } }
        .gl-decode-block { transition: border-color .2s, box-shadow .2s; }
        .gl-decode-block:hover, .gl-decode-block.gl-decoding { border-color: rgba(255,42,31,.5) !important; box-shadow: 0 0 32px rgba(255,42,31,.06); }
        .gl-decode-block.gl-decoded { border-color: rgba(57,255,20,.4) !important; box-shadow: 0 0 32px rgba(57,255,20,.06); }
        .gl-decode-block.gl-decoded .gl-text-ref { color: #39ff14 !important; }
        .gl-decode-block.gl-decoded .gl-bar-ref  { background: #39ff14 !important; width: 100% !important; }
        .gl-cta-ref[data-success] { color: #39ff14 !important; }
        @media (max-width: 600px) { .help-root { padding: 40px 16px 72px !important; } }
      `}</style>

      <div style={{ width: '100%', maxWidth: 760, display: 'flex', flexDirection: 'column' }}>

        {/* ════ HEADER ════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingBottom: 36, marginBottom: 52, borderBottom: '1px solid rgba(57,255,20,.07)' }}>
          <span style={{ fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: 'rgba(57,255,20,.28)' }}>SECURE TERMINAL v4.7.1</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: '0.09em', color: '#fff', lineHeight: 1.15 }}>
              CLASSIFIED <span style={{ color: '#39ff14' }}>ACCESS</span>
            </span>
          </div>
          <span style={{ fontSize: 9, letterSpacing: '0.22em', color: 'rgba(255,255,255,.14)', marginTop: 6 }}>
            ENCRYPTION · AES-256-GCM · CHANNEL AUTHENTICATED
          </span>
          <span style={{ fontSize: 9, letterSpacing: '0.22em', color: 'rgba(255,255,255,.14)', marginTop: 6 }}>
            SOMETHINGS ARE ONLY REVEALED WHEN LIGHT SHINES
          </span>
        </div>

        {/* ════ SYSTEM STATUS ════ */}
        <div style={{ marginBottom: 48 }}>
          <SectionLabel>system status</SectionLabel>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 26px', background: 'rgba(57,255,20,.025)', border: '1px solid rgba(57,255,20,.09)', borderRadius: 6 }}>
            <SignalBars level={sigLevel} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(57,255,20,.28)' }}>UPTIME</span>
              <UptimeTicker />
            </div>
          </div>
        </div>

        {/* ════ INTERCEPTED SIGNAL ════ */}
        <div style={{ marginBottom: 48 }}>
          <SectionLabel>intercepted signal</SectionLabel>
          <div
            ref={blockRef}
            className="gl-decode-block"
            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 20, cursor: 'crosshair', userSelect: 'none', position: 'relative', overflow: 'hidden', border: '1px solid rgba(57,255,20,.1)', background: '#050505', padding: '28px 28px 24px', borderRadius: 6, boxSizing: 'border-box' }}
            onMouseEnter={glStartDecode}
            onMouseLeave={glStopDecode}
          >
            <div style={{ pointerEvents: 'none', position: 'absolute', left: 0, right: 0, height: 52, background: 'linear-gradient(transparent, rgba(57,255,20,.012), transparent)', animation: 'scan 3.5s linear infinite' }} />
            <div style={{ pointerEvents: 'none', position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.09) 2px,rgba(0,0,0,.09) 4px)' }} />
            <span ref={textRef} className="gl-text-ref" style={{ position: 'relative', zIndex: 1, fontSize: 11, letterSpacing: '0.18em', lineHeight: 2.1, wordBreak: 'break-word', color: '#2a2a2a', transition: 'color .3s', width: '100%' }}>
              {GLITCH_IDLE}
            </span>
            <div style={{ width: '100%', height: 2, background: 'rgba(255,255,255,.05)', overflow: 'hidden', borderRadius: 1 }}>
              <div ref={barRef} className="gl-bar-ref" style={{ height: '100%', width: '0%', background: '#ff2a1f', transition: 'width .04s linear' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
              <span ref={ctaRef} className="gl-cta-ref" style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(57,255,20,.2)' }}>[ HOVER TO DECODE ]</span>
              <span ref={pctRef} style={{ fontSize: 9, letterSpacing: '0.12em', fontVariantNumeric: 'tabular-nums', color: 'rgba(255,42,31,.4)' }}>0%</span>
            </div>
          </div>
        </div>

        {/* ════ CLASSIFIED RECORDS ════ */}
        <div style={{ marginBottom: 48 }}>
          <SectionLabel>classified records — click to reveal</SectionLabel>
          <div style={{ background: '#040404', border: '1px solid rgba(57,255,20,.08)', borderRadius: 6, overflow: 'hidden' }}>
            {CLASSIFIED_RECORDS.map((r, i) => (
              <div key={r.key} style={i === CLASSIFIED_RECORDS.length - 1 ? { borderBottom: 'none' } : {}}>
                <RedactRow rec={r} />
              </div>
            ))}
          </div>
        </div>

        {/* ════ TERMINAL LOG ════ */}
        <div style={{ marginBottom: 48 }}>
          <SectionLabel>corrupted system log</SectionLabel>
          <TerminalLog />
        </div>

        {/* ════ DIVIDER ════ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 48, opacity: 0.15 }}>
          <div style={{ flex: 1, height: 1, background: '#39ff14' }} />
          <span style={{ color: '#39ff14', fontSize: 13 }}>◈</span>
          <div style={{ flex: 1, height: 1, background: '#39ff14' }} />
        </div>

        {/* ════ QR SECTION ════ */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, background: '#040404', border: '1px solid rgba(57,255,20,.08)', borderRadius: 6, padding: '48px 36px 52px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ pointerEvents: 'none', position: 'absolute', bottom: 0, left: 0, right: 0, height: 64, background: 'linear-gradient(transparent, rgba(57,255,20,.018))' }} />
          <span style={{ fontSize: 9, letterSpacing: '0.36em', textTransform: 'uppercase', color: 'rgba(57,255,20,.5)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>▣</span> AUDIO FRAGMENT DETECTED
          </span>
          <div style={{ width: 160, height: 160, background: '#fff', padding: 10, border: '1px solid rgba(57,255,20,.1)', position: 'relative', marginTop: 4, marginBottom: 4 }}>
            {[
              { top: 0,    left: 0,  borderTop: '1px solid rgba(57,255,20,.5)', borderLeft:  '1px solid rgba(57,255,20,.5)' },
              { top: 0,    right: 0, borderTop: '1px solid rgba(57,255,20,.5)', borderRight: '1px solid rgba(57,255,20,.5)' },
              { bottom: 0, left: 0,  borderBottom: '1px solid rgba(57,255,20,.5)', borderLeft:  '1px solid rgba(57,255,20,.5)' },
              { bottom: 0, right: 0, borderBottom: '1px solid rgba(57,255,20,.5)', borderRight: '1px solid rgba(57,255,20,.5)' },
            ].map((s, i) => (
              <div key={i} style={{ position: 'absolute', width: 12, height: 12, ...s }} />
            ))}
            <img src="/qr/qrcode.png" alt="Audio Fragment QR Code" style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated', display: 'block', position: 'relative', zIndex: 1 }} />
          </div>
          <span style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(57,255,20,.16)' }}>SCAN IF YOU CAN</span>
        </div>

        {/* ════ HIDDEN SEQUENCE — only visible in light mode ════
            color matches dark background — invisible until bg changes
            participants find this by switching background to light via console/inspect */}
        <div
          style={{
            marginTop: 0,
            padding: '5px 12px',
            background: '#000',
            border: '1px solid #000',
            borderRadius: 6,
          }}
        >
          <div style={{ marginTop: 0, padding: '24px 28px', background: '#000000', border: 'none', borderRadius: 6, userSelect: 'none', pointerEvents: 'none' }}>
            <div style={{ fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase', color: '#000000', marginBottom: 20, fontFamily: "'JetBrains Mono','Courier New',monospace", textAlign: 'center' }}>
              ACCESS_PROTOCOL — SEQUENCE RECOVERED
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, fontFamily: "'JetBrains Mono','Courier New',monospace" }}>
              {['↑', '↓', '←', '→', 'F10'].map((k, i) => (
              <span key={i} style={{ fontSize: 16, letterSpacing: '0.12em', color: '#000000' }}>{k}</span>
              ))}
            </div>
            <div style={{ marginTop: 20, fontSize: 9, letterSpacing: '0.24em', color: '#000000', lineHeight: 2, textAlign: 'center' }}>
              execute in order — wait for silence — navigate to resources
            </div>
          </div>
        </div>
        {/* ════ END HIDDEN SEQUENCE ════ */}
      </div>
    </div>
  );
};

export default Help;
