// src/hooks/useXORKey.js
// ─────────────────────────────────────────────────────────────────────────────
// Hook that tracks XOR key fragment collection state in real time.
// Re-checks every 2 seconds so the UI updates as users find fragments.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { resolveSignalKey, hasVisitedLogs } from "../utils/xorSignal";

export default function useXORKey() {
  const [keyState, setKeyState] = useState({
    allFound: false,
    found: { alpha: false, bravo: false, charlie: false },
    foundCount: 0,
    plaintext: null,
    masterKey: null,
  });
  const [logsVisited, setLogsVisited] = useState(false);

  const refresh = () => {
    setKeyState(resolveSignalKey());
    setLogsVisited(hasVisitedLogs());
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, []);

  return { ...keyState, logsVisited, refresh };
}