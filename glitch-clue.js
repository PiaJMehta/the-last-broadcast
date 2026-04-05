// ── GLITCH ANIMATION CLUE ──────────────────────────────────
// Drop this file into the project and add these two lines
// at the bottom of the main HTML file:
//   <link rel="stylesheet" href="glitch-clue.css">
//   <script src="glitch-clue.js"></script>
// ────────────────────────────────────────────────────────────

const GLITCH_CHARS  = '!@#$%^&*<>/?\\|█▓▒░╗╔╝╚═║';
const GLITCH_TARGET = 'IMPLEMENT → GLITCH TEXT ANIMATION :: FEATURE UNLOCKED';
const GLITCH_IDLE   = 'YOU CAN READ IT, IF YOU COULD JUST STAY STILL...';

let glDecoded = false, glDecoding = false, glProgress = 0;
let glDecodeInterval = null, glPassiveInterval = null;

function glStartPassive() {
  if (glPassiveInterval) return;
  glPassiveInterval = setInterval(() => {
    if (glDecoding || glDecoded) return;
    const el = document.getElementById('gl-text');
    if (!el) return;
    el.textContent = GLITCH_IDLE.split('').map(c =>
      c !== ' ' && Math.random() < 0.07
        ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] : c
    ).join('');
  }, 90);
}

function glScramble(prog) {
  return GLITCH_TARGET.split('').map((c, i) => {
    if (c === ' ' || c === '→') return c;
    return prog >= i / GLITCH_TARGET.length
      ? c : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
  }).join('');
}

function glStartDecode() {
  if (glDecoded) return;
  clearInterval(glPassiveInterval); glPassiveInterval = null;
  glDecoding = true; glProgress = 0;
  const block = document.getElementById('gl-block');
  if (block) block.classList.add('decoding');
  const cta = document.getElementById('gl-cta');
  if (cta) cta.textContent = 'DECODING...';
  glDecodeInterval = setInterval(() => {
    glProgress += 0.018;
    const el  = document.getElementById('gl-text');
    const bar = document.getElementById('gl-bar');
    if (glProgress >= 1) {
      clearInterval(glDecodeInterval);
      if (el)  el.textContent = GLITCH_TARGET;
      if (bar) bar.style.width = '100%';
      const b = document.getElementById('gl-block');
      if (b) { b.classList.remove('decoding'); b.classList.add('decoded'); }
      const c = document.getElementById('gl-cta');
      if (c)  { c.textContent = '✓ TRANSMISSION RECOVERED'; c.className = 'gl-success'; }
      glDecoded = true; glDecoding = false;
      return;
    }
    if (el)  el.textContent = glScramble(glProgress);
    if (bar) bar.style.width = (glProgress * 100) + '%';
  }, 40);
}

function glStopDecode() {
  if (glDecoded) return;
  clearInterval(glDecodeInterval);
  glDecoding = false; glProgress = 0;
  const block = document.getElementById('gl-block');
  const bar   = document.getElementById('gl-bar');
  const el    = document.getElementById('gl-text');
  const cta   = document.getElementById('gl-cta');
  if (block) block.classList.remove('decoding');
  if (bar)   bar.style.width = '0%';
  if (el)    el.textContent = GLITCH_IDLE;
  if (cta)   cta.textContent = '[ HOVER TO DECODE ]';
  glStartPassive();
}

// ── Inject TX-009 into the existing txlist ──────────────────
(function injectGlitchEntry() {
  const list = document.getElementById('txlist');
  if (!list) return;

  const entry = document.createElement('div');
  entry.className = 'gl-entry';
  entry.innerHTML = `
    <div class="gl-entry-head">
      <span class="gl-entry-id">TX-009</span>
      <span class="gl-entry-time">04:17:44 UTC</span>
    </div>
    <div style="font-size:10px;color:var(--dim);letter-spacing:2px;margin-bottom:8px;">// INTERCEPTED SIGNAL</div>
    <div class="gl-decode-block" id="gl-block"
      onmouseenter="glStartDecode()" onmouseleave="glStopDecode()">
      <span class="gl-code-text" id="gl-text">${GLITCH_IDLE}</span>
      <div class="gl-progress-wrap"><div class="gl-progress-bar" id="gl-bar"></div></div>
      <span class="gl-cta" id="gl-cta">[ HOVER TO DECODE ]</span>
    </div>`;

  list.appendChild(entry);
  glStartPassive();
})();
