
export const CIPHERTEXT_HEX =
  "5d7944785179517a40d692a65577577b46705d7b5a0e477157605d7b5a674b794167406b516c44755a70";

export function getFragmentAlpha() {
  const el = document.querySelector("[data-key-alpha]");
  if (el) return el.getAttribute("data-key-alpha");
  return localStorage.getItem("fragment_alpha");
}

export function getFragmentBravo() {
  const match = document.cookie.match(/vault_clue=([^;]+)/);
  if (!match) return null;
  try {
    const decoded = atob(decodeURIComponent(match[1]));
    const b0 = decoded.charCodeAt(4).toString(16).padStart(2, "0");
    const b1 = decoded.charCodeAt(5).toString(16).padStart(2, "0");
    return b0 + b1;
  } catch {
    return null;
  }
}

export function getFragmentCharlie() {
  const raw = localStorage.getItem("SYS_FRAGMENT_PROFILE");
  if (!raw) return null;
  try {
    const decoded = atob(raw);
    const b0 = decoded.charCodeAt(6).toString(16).padStart(2, "00");
    const b1 = decoded.charCodeAt(7).toString(16).padStart(2, "00");
    return b0 + b1;
  } catch {
    return null;
  }
}

// ── XOR Core ─────────────────────────────────────────────────────────────────


function hexToBytes(hex) {
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }
  return new Uint8Array(bytes);
}


function xorArrays(a, b) {
  return a.map((byte, i) => byte ^ b[i % b.length]);
}


export function assembleMasterKey(alphaHex, bravoHex, charlieHex) {
  const a = hexToBytes(alphaHex);
  const b = hexToBytes(bravoHex);
  const c = hexToBytes(charlieHex);
  const ab = xorArrays(a, b);
  return xorArrays(ab, c);
}


export function decryptTransmission(masterKey) {
  try {
    const cipher = hexToBytes(CIPHERTEXT_HEX);
    const plain = xorArrays(cipher, masterKey);
    return Array.from(plain)
      .map((b) => String.fromCharCode(b))
      .join("");
  } catch {
    return null;
  }
}

export function resolveSignalKey() {
  const alpha = getFragmentAlpha();
  const bravo = getFragmentBravo();
  const charlie = getFragmentCharlie();

  const found = {
    alpha: !!alpha,
    bravo: !!bravo,
    charlie: !!charlie,
  };
  const foundCount = Object.values(found).filter(Boolean).length;
  const allFound = foundCount === 3;

  if (!allFound) {
    return { allFound: false, found, foundCount, plaintext: null, masterKey: null };
  }

  const masterKey = assembleMasterKey(alpha, bravo, charlie);
  const plaintext = decryptTransmission(masterKey);

  return {
    allFound: true,
    found,
    foundCount,
    masterKey: Array.from(masterKey)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
    plaintext,
  };
}


export function hasVisitedLogs() {
  return localStorage.getItem("tlb_logs_visited") === "1";
}

export function markLogsVisited() {
  localStorage.setItem("tlb_logs_visited", "1");
}