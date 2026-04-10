import React, { useEffect, useRef, useState } from 'react';

// ── ACCESS_PROTOCOL (fragment 1 of 5) ────────────────────────
// step_1 = ArrowUp
// ─────────────────────────────────────────────────────────────

const SEQUENCE     = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'F10'];
const Z_PATTERN    = [0, 1, 2, 4, 6, 7, 8];
const GLITCH_CHARS = '!@#$%^&*<>╗╔╝╚═║▓▒░';
const SILENCE_MS   = 10000;

function scramble(str) {
  return str.split('').map(c =>
    c === ' ' ? ' ' : Math.random() < 0.4
      ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] : c
  ).join('');
}

export default function Resources() {
  const ciphers = [
    { id: '01', data: 'im going to write the encoded msgs here' },
    // ── ACCESS_PROTOCOL (fragment 2 of 5) ──────────────────
    // step_2 = ArrowDown
    // ───────────────────────────────────────────────────────
    { id: '02', data: '' },
    { id: '03', data: '' },
    // ── ACCESS_PROTOCOL (fragment 3 of 5) ──────────────────
    // step_3 = ArrowLeft
    // ───────────────────────────────────────────────────────
    { id: '04', data: '' },
    { id: '05', data: '' },
    // ── ACCESS_PROTOCOL (fragment 4 of 5) ──────────────────
    // step_4 = ArrowRight
    // ───────────────────────────────────────────────────────
    { id: '06', data: '' },
    { id: '07', data: '' },
    // ── ACCESS_PROTOCOL (fragment 5 of 5) ──────────────────
    // step_5 = F10 :: execute_sequence_in_order
    // ───────────────────────────────────────────────────────
    { id: '08', data: '' },
    { id: '09', data: '' },
    { id: '10', data: '' },
  ];

  const [phase, setPhase]               = useState('idle');
  const [overlay, setOverlay]           = useState(null);
  const [patternPath, setPatternPath]   = useState([]);
  const [patternError, setPatternError] = useState(false);
  const [drawing, setDrawing]           = useState(false);
  const [scrambledMsg, setScrambledMsg] = useState('DO NOT TOUCH ANYTHING');

  const phaseRef      = useRef('idle');
  const seqIdxRef     = useRef(0);
  const lastKeyTime   = useRef(null);  // tracks when last key was pressed
  const overlayTimer  = useRef(null);  // auto-dismiss warning
  const scrambleInt   = useRef(null);

  function setPhaseSync(p) {
    phaseRef.current = p;
    setPhase(p);
  }

  // ── one-way freeze ──
  useEffect(() => {
    function check() {
      if (window.innerWidth <= 600 && phaseRef.current === 'idle') {
        setPhaseSync('frozen');
        lastKeyTime.current = null;
        seqIdxRef.current = 0;
      }
    }
    window.addEventListener('resize', check);
    check();
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── freeze cursor ──
  useEffect(() => {
    const id = 'freeze-style';
    let el = document.getElementById(id);
    if (phase === 'frozen' || phase === 'warn' || phase === 'sequencing') {
      if (!el) { el = document.createElement('style'); el.id = id; document.head.appendChild(el); }
      el.textContent = `
        * { cursor: none !important; pointer-events: none !important; }
        #unfreeze-overlay, #unfreeze-overlay * { pointer-events: all !important; }
      `;
    } else {
      if (el) el.remove();
    }
    return () => { const s = document.getElementById(id); if (s) s.remove(); };
  }, [phase]);

  // ── key listener ──
  useEffect(() => {
    function onKey(e) {
      const p = phaseRef.current;
      if (p === 'idle' || p === 'pattern' || p === 'unlocked') return;

      const now = Date.now();
      const silenceOk = lastKeyTime.current === null
        ? false
        : (now - lastKeyTime.current) >= SILENCE_MS;

      // ── in sequence mode: they started the sequence correctly ──
      if (p === 'sequencing') {
        const expected = SEQUENCE[seqIdxRef.current];
        if (e.key === expected) {
          seqIdxRef.current += 1;
          if (seqIdxRef.current >= SEQUENCE.length) {
            // sequence complete!
            seqIdxRef.current = 0;
            lastKeyTime.current = null;
            stopScramble();
            setPhaseSync('pattern');
            setOverlay('pattern');
            setPatternPath([]);
            setPatternError(false);
          }
          // correct key mid-sequence — don't flash warning, just continue
          return;
        } else {
          // wrong key mid-sequence → reset, flash warning
          seqIdxRef.current = 0;
          setPhaseSync('frozen');
          lastKeyTime.current = now;
          flashWarn();
          return;
        }
      }

      // ── frozen or warn phase: any key ──
      // check if 10s silence has passed AND this is the start key (↑)
      if (silenceOk && e.key === SEQUENCE[0]) {
        // start sequence!
        seqIdxRef.current = 1;
        setPhaseSync('sequencing');
        // don't flash warning — they did it right
        lastKeyTime.current = now;
        return;
      }

      // any other key (or right key but too early) → flash warning + reset timer
      lastKeyTime.current = now;
      seqIdxRef.current = 0;
      flashWarn();
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function flashWarn() {
    startScramble('DO NOT TOUCH ANYTHING');
    setOverlay('early');
    clearTimeout(overlayTimer.current);
    overlayTimer.current = setTimeout(() => {
      stopScramble();
      setOverlay(null);
    }, 2500);
  }

  function startScramble(base) {
    stopScramble();
    setScrambledMsg(base);
    scrambleInt.current = setInterval(() => setScrambledMsg(scramble(base)), 60);
  }

  function stopScramble() {
    clearInterval(scrambleInt.current);
    scrambleInt.current = null;
  }

  function resetAll() {
    stopScramble();
    clearTimeout(overlayTimer.current);
    setPhaseSync('idle');
    setOverlay(null);
    setPatternPath([]);
    setPatternError(false);
    setDrawing(false);
    lastKeyTime.current = null;
    seqIdxRef.current = 0;
    const s = document.getElementById('freeze-style');
    if (s) s.remove();
  }

  // ── pattern drawing ──
  function handleCellDown(i) {
    setDrawing(true);
    setPatternPath([i]);
    setPatternError(false);
  }

  function handleCellEnter(i) {
    if (!drawing) return;
    setPatternPath(prev => prev.includes(i) ? prev : [...prev, i]);
  }

  function handleMouseUp() {
    if (!drawing) return;
    setDrawing(false);
    setPatternPath(prev => {
      const valid = Z_PATTERN.every((v, i) => prev[i] === v) && prev.length === Z_PATTERN.length;
      if (valid) {
        stopScramble();
        setPhaseSync('unlocked');
        setOverlay('unlocked');
        const s = document.getElementById('freeze-style');
        if (s) s.remove();
      } else {
        setPatternError(true);
        setTimeout(() => { setPatternPath([]); setPatternError(false); }, 500);
      }
      return prev;
    });
  }

  // ── shared styles ──
  const wrapStyle = {
    position: 'fixed', inset: 0, zIndex: 99999,
    background: 'rgba(0,0,0,0.95)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Share Tech Mono','Courier New',monospace",
    pointerEvents: 'all',
  };
  const scanStyle = {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'repeating-linear-gradient(to bottom,transparent,transparent 2px,rgba(0,0,0,0.3) 2px,rgba(0,0,0,0.3) 4px)',
  };
  const boxBase = {
    position: 'relative', zIndex: 2,
    padding: '28px 32px', maxWidth: 400, width: '90%',
    textAlign: 'center', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 10, background: '#050505',
  };
  const staticBar = (
    <div style={{
      width: '100%', height: 3, margin: '2px 0',
      background: 'repeating-linear-gradient(90deg,#ff2a1f,#ff2a1f 2px,transparent 2px,transparent 6px)',
      animation: 'slideBar 0.1s linear infinite',
    }} />
  );

  return (
    <>
      <style>{`
        @keyframes chaosGlitch {
          0%   { transform:translate(0) skewX(0deg);         text-shadow:-3px 0 #0ff,3px 0 #f0f; }
          10%  { transform:translate(-4px,1px) skewX(-3deg); text-shadow:3px 0 #0ff,-3px 0 #f0f; }
          20%  { transform:translate(3px,-2px) skewX(2deg);  text-shadow:-2px 0 #39ff14,4px 0 #ff2a1f; }
          30%  { transform:translate(-2px,2px) skewX(-1deg); text-shadow:none; }
          40%  { transform:translate(4px,0) skewX(3deg);     text-shadow:-4px 0 #0ff,2px 0 #f0f; }
          50%  { transform:translate(0) skewX(0deg);         text-shadow:3px 0 #ff2a1f,-3px 0 #0ff; }
          60%  { transform:translate(-3px,-1px) skewX(-2deg);text-shadow:none; }
          70%  { transform:translate(2px,2px) skewX(1deg);   text-shadow:-2px 0 #f0f,2px 0 #39ff14; }
          80%  { transform:translate(-4px,0) skewX(-3deg);   text-shadow:4px 0 #0ff,-2px 0 #ff2a1f; }
          90%  { transform:translate(3px,-2px) skewX(2deg);  text-shadow:none; }
          100% { transform:translate(0) skewX(0deg);         text-shadow:-3px 0 #0ff,3px 0 #f0f; }
        }
        @keyframes shakeBox {
          0%,100%{transform:translate(0);}
          10%{transform:translate(-3px,2px);}  20%{transform:translate(3px,-2px);}
          30%{transform:translate(-2px,3px);}  40%{transform:translate(2px,-1px);}
          50%{transform:translate(-4px,1px);}  60%{transform:translate(4px,2px);}
          70%{transform:translate(-1px,-3px);} 80%{transform:translate(3px,1px);}
          90%{transform:translate(-2px,-2px);}
        }
        @keyframes flicker {
          0%,100%{opacity:1;} 15%{opacity:0.2;} 30%{opacity:1;}
          45%{opacity:0.5;}   60%{opacity:0.1;} 75%{opacity:1;} 90%{opacity:0.3;}
        }
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes slideBar { from{background-position:0 0} to{background-position:12px 0} }
      `}</style>

      {/* ── WARN OVERLAY ── */}
      {overlay === 'early' && (
        <div style={wrapStyle} id="unfreeze-overlay">
          <div style={scanStyle} />
          <div style={{ ...boxBase, border: '1px solid #ff2a1f', animation: 'shakeBox 0.1s infinite' }}>
            {staticBar}{staticBar}
            <div style={{ fontSize: 20, letterSpacing: 4, fontWeight: 700, color: '#ff2a1f', animation: 'chaosGlitch 0.15s infinite' }}>
              ⚠ SYSTEM UNSTABLE
            </div>
            {staticBar}
            <div style={{ fontSize: 11, letterSpacing: 3, color: '#ff2a1f', animation: 'flicker 0.3s infinite' }}>
              {scrambledMsg}
            </div>
            <div style={{ fontSize: 9, letterSpacing: 2, color: '#ff2a1f', opacity: 0.6, animation: 'blink 0.4s step-end infinite' }}>
              signal destabilised — stand by —
            </div>
            {staticBar}
            <div style={{ fontSize: 9, color: '#ff2a1f', letterSpacing: 2, animation: 'flicker 0.2s infinite' }}>
              ERR_0x{Math.floor(Math.random() * 9999).toString(16).toUpperCase()}
            </div>
            {staticBar}
          </div>
        </div>
      )}

      {/* ── PATTERN OVERLAY ── */}
      {overlay === 'pattern' && (
        <div style={wrapStyle} id="unfreeze-overlay">
          <div style={scanStyle} />
          <div style={{ ...boxBase, border: '1px solid #ff6b00', animation: 'shakeBox 0.2s infinite' }}>
            {staticBar}
            <div style={{ fontSize: 18, letterSpacing: 4, fontWeight: 700, color: '#ff6b00', animation: 'chaosGlitch 0.2s infinite' }}>
              ⚠ SYSTEM STILL UNSTABLE
            </div>
            {staticBar}
            <div style={{ fontSize: 11, letterSpacing: 3, color: '#ff6b00' }}>DRAW PATTERN TO RESTORE</div>
            <div style={{ fontSize: 9, letterSpacing: 2, color: '#ff6b00', opacity: 0.6, animation: 'blink 0.5s step-end infinite' }}>
              connect the nodes — restore signal
            </div>
            {staticBar}
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 8, userSelect: 'none' }}
              onMouseLeave={() => { if (drawing) { setDrawing(false); setPatternPath([]); setPatternError(false); } }}
              onMouseUp={handleMouseUp}
            >
              {[0,1,2,3,4,5,6,7,8].map(i => (
                <div
                  key={i}
                  style={{
                    width: 58, height: 58,
                    border: `1px solid ${patternError ? '#ff2a1f' : patternPath.includes(i) ? '#ff6b00' : '#2a2a00'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'crosshair', transition: 'all 0.1s',
                    background: patternPath.includes(i) ? 'rgba(255,107,0,0.15)' : 'transparent',
                  }}
                  onMouseDown={() => handleCellDown(i)}
                  onMouseEnter={() => handleCellEnter(i)}
                >
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%', transition: 'background 0.1s',
                    background: patternError ? '#ff2a1f' : patternPath.includes(i) ? '#ff6b00' : '#2a2a00',
                  }} />
                </div>
              ))}
            </div>
            {patternError && (
              <div style={{ color: '#ff2a1f', fontSize: 9, letterSpacing: 2, marginTop: 4 }}>
                PATTERN REJECTED — TRY AGAIN
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── UNLOCKED OVERLAY ── */}
      {overlay === 'unlocked' && (
        <div style={wrapStyle} id="unfreeze-overlay">
          <div style={scanStyle} />
          <div style={{ ...boxBase, border: '1px solid #39ff14' }}>
            <div style={{ fontSize: 18, letterSpacing: 4, fontWeight: 700, color: '#39ff14' }}>✓ SYSTEM STABILISED</div>
            <div style={{ fontSize: 11, letterSpacing: 3, color: '#39ff14' }}>SIGNAL UNLOCKED</div>
            <div style={{
              marginTop: 12, padding: '14px 18px',
              border: '1px solid #39ff14', background: 'rgba(57,255,20,0.04)',
              color: '#39ff14', fontSize: 11, lineHeight: 2, letterSpacing: 1, textAlign: 'left', width: '100%',
            }}>
              REQUIREMENT: Implement a mini game.<br />
              <span style={{ fontSize: 9, color: '#2a7a2a' }}>It must be playable. A winning condition must exist.</span>
            </div>
            <button
              onClick={resetAll}
              style={{
                marginTop: 12, background: 'transparent',
                border: '1px solid #39ff14', color: '#39ff14',
                padding: '7px 18px', cursor: 'crosshair',
                fontFamily: "'Share Tech Mono','Courier New',monospace",
                fontSize: 9, letterSpacing: 2,
              }}
            >CLOSE TRANSMISSION</button>
          </div>
        </div>
      )}

      {/* ── ACCESS_PROTOCOL (fragment 1 of 5) — step_1 = ArrowUp ── */}
      <div className="max-w-7xl mx-auto py-20 px-10 font-mono min-h-screen">

        <h1 className="text-4xl font-black mb-8 border-b border-green-500 pb-2">
          {/* ACCESS_PROTOCOL (fragment 2 of 5) — step_2 = ArrowDown */}
          // SURVIVAL_RESOURCES.DB
        </h1>

        <p className="text-[10px] mb-8 opacity-50 uppercase tracking-[0.3em]">
          {/* ACCESS_PROTOCOL (fragment 3 of 5) — step_3 = ArrowLeft */}
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
                {/* ACCESS_PROTOCOL (fragment 4 of 5) — step_4 = ArrowRight */}
              </div>
              <div className="bg-black/40 p-3 border border-green-900/20 break-all">
                <code className="text-xs text-green-500 opacity-80 group-hover:opacity-100">
                  {item.data}
                  {/* ACCESS_PROTOCOL (fragment 5 of 5) — step_5 = F10 :: execute_sequence_in_order */}
                </code>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
