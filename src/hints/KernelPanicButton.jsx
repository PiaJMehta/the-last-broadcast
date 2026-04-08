import { useState, useEffect, useRef } from "react";

export default function KernelPanicButton() {
  const [isPanicking, setIsPanicking] = useState(false);
  const [hasPanicked, setHasPanicked] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isDoomed, setIsDoomed] = useState(false);
  const [pressCount, setPressCount] = useState(0);
  const pollRef = useRef(null);

  // Poll PressCounter's localStorage count for distraction mode
  useEffect(() => {
    pollRef.current = setInterval(() => {
      const val = parseInt(localStorage.getItem('hint_press_counter_count') || '0', 10);
      setPressCount(val);
    }, 500);
    return () => clearInterval(pollRef.current);
  }, []);

  // Distraction thresholds
  const isDistracted = pressCount >= 55 && pressCount < 67 && !hasPanicked;
  const distractionIntensity = isDistracted ? Math.min((pressCount - 55) / 12, 1) : 0; // 0→1 over 55-67

  const handlePress = () => {
    if (isPanicking || isDoomed) return;

    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (nextCount >= 8) {
      setIsDoomed(true);

      // Wait 1.2s to let them read "NICE KNOWING YOU...", then blow it up
      setTimeout(() => {
        setIsPanicking(true);
        setHasPanicked(false);

        // Lock them out for 6 full seconds of chaos
        setTimeout(() => {
          setIsPanicking(false);
          setIsDoomed(false);
          setHasPanicked(true);
          setClickCount(0); // Reset for next interaction
        }, 6000);
      }, 1200);
    }
  };

  const getButtonText = () => {
    if (isPanicking) return "OVERLOADING...";
    if (isDoomed) return "NICE KNOWING YOU...";
    if (clickCount === 0) return "DO NOT PRESS";
    if (clickCount === 1) return "ARE YOU SURE?!";
    if (clickCount === 2) return "I SAID STOP!!";
    if (clickCount === 3) return "WHAT ARE YOU DOING?!";
    if (clickCount === 4) return "YOU WILL BREAK THE KERNEL!!";
    if (clickCount === 5) return "CRITICAL INTEGRITY RISK!";
    if (clickCount === 6) return "STOP IMMEDIATELY!!";
    if (clickCount === 7) return "ABSOLUTE LAST WARNING!!!";
    return "DO NOT PRESS";
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes decoyGlitch {
          0% { transform: translate(0) }
          20% { transform: translate(-2px, 1px) }
          40% { transform: translate(-1px, -1px) }
          60% { transform: translate(2px, 1px) }
          80% { transform: translate(1px, -1px) }
          100% { transform: translate(0) }
        }
        @keyframes fadeInTroll {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes doomedPulse {
          0%, 100% { transform: scale(1); opacity: 1; text-shadow: 0 0 10px rgba(255,0,0,0.5); }
          50% { transform: scale(1.05); opacity: 0.8; text-shadow: 0 0 20px rgba(255,0,0,1); }
        }
        @keyframes distractPulse {
          0%, 100% { box-shadow: 0 0 10px rgba(255,0,0,0.2); border-color: rgba(255,0,0,0.3); }
          50% { box-shadow: 0 0 35px rgba(255,0,0,0.6), 0 0 60px rgba(255,0,0,0.2); border-color: #ff0000; }
        }
        @keyframes distractButtonThrob {
          0%, 100% { transform: scale(1); box-shadow: 0 0 15px rgba(255,0,0,0.2); }
          50% { transform: scale(1.08); box-shadow: 0 0 30px rgba(255,0,0,0.6), 0 0 50px rgba(255,0,0,0.15); }
        }
        @keyframes distractTextFlicker {
          0%, 100% { opacity: 0.9; }
          30% { opacity: 0.4; }
          60% { opacity: 1; }
          80% { opacity: 0.3; }
        }
      `}</style>

      {/* Global Overrides while panicking */}
      {isPanicking && (
        <style>{`
          body {
            /* Aggressive full-screen shake */
            animation: kernelPanicScreenShake 0.08s infinite !important;
            overflow: hidden !important;
          }
          @keyframes kernelPanicScreenShake {
            0% { transform: translate(2px, 1px) rotate(0deg); filter: hue-rotate(0deg) contrast(1.2); }
            10% { transform: translate(-4px, -3px) rotate(-1deg); filter: hue-rotate(90deg) contrast(1.5); }
            20% { transform: translate(-3px, 0px) rotate(2deg); filter: invert(0.1); }
            30% { transform: translate(4px, 3px) rotate(0deg); filter: hue-rotate(180deg); }
            40% { transform: translate(1px, -1px) rotate(2deg); filter: invert(0.8); }
            50% { transform: translate(-1px, 3px) rotate(-2deg); filter: hue-rotate(270deg) contrast(2); }
            60% { transform: translate(-4px, 1px) rotate(0deg); filter: invert(0); }
            70% { transform: translate(4px, 1px) rotate(-2deg); filter: hue-rotate(90deg); }
            80% { transform: translate(-1px, -1px) rotate(2deg); filter: invert(0.4); }
            90% { transform: translate(1px, 3px) rotate(0deg); filter: hue-rotate(0deg); }
            100% { transform: translate(1px, -3px) rotate(-2deg); filter: invert(1); }
          }
        `}</style>
      )}

      {/* Full-screen invisible blocker overlay */}
      {isPanicking && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 999999,
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.1) 3px, rgba(255,0,0,0.1) 4px)",
          pointerEvents: "all", // Prevents user from clicking anything on the page
          cursor: "not-allowed"
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle, transparent 20%, rgba(255,0,0,0.4) 100%)',
            pointerEvents: 'none'
          }} />
        </div>
      )}

      <div
        style={{
          width: "100%",
          background: isPanicking ? "rgba(255,0,0,0.2)" : isDistracted ? `rgba(255,0,0,${0.03 + distractionIntensity * 0.08})` : "#0a0000",
          color: "#808080",
          fontFamily: "'Share Tech Mono', monospace",
          padding: "24px",
          position: "relative",
          border: isPanicking ? "2px solid #ff0000" : "1px solid rgba(255,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxSizing: "border-box",
          transition: "background 0.3s, border 0.3s",
          animation: isDistracted && !isPanicking && !isDoomed
            ? `distractPulse ${1.2 - distractionIntensity * 0.7}s ease-in-out infinite`
            : "none",
        }}
      >
        <div
          style={{
            fontSize: "10px",
            letterSpacing: "4px",
            color: "#ff3333",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            width: "100%",
            gap: "10px",
          }}
        >
          {isPanicking ? "!!! CRITICAL SYSTEM FAILURE !!!" : (
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div>RESTRICTED PROTOCOL</div>
              <div style={{ color: "#ffffff", fontSize: "9px", letterSpacing: "2px", opacity: 0.9 }}>FLASH WARNING</div>
            </div>
          )}
          <div style={{ flex: 1, height: "1px", background: "#ff3333", opacity: 0.5 }} />
        </div>

        <button
          onClick={handlePress}
          style={{
            background: isPanicking ? "#ff0000" : "rgba(255,0,0,0.05)",
            border: `2px solid ${isPanicking ? "#ffffff" : "#ff0000"}`,
            color: isPanicking ? "#ffffff" : "#ff0000",
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "20px",
            fontWeight: "bold",
            letterSpacing: "3px",
            padding: "20px 40px",
            cursor: isPanicking ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            textShadow: isPanicking ? "0 0 10px #ffffff" : "0 0 10px rgba(255,0,0,0.5)",
            boxShadow: isPanicking ? "0 0 40px #ff0000" : "0 0 15px rgba(255,0,0,0.2)",
            animation: isPanicking
              ? "decoyGlitch 0.05s infinite"
              : isDoomed
                ? "doomedPulse 0.4s ease-in-out infinite"
                : isDistracted
                  ? `distractButtonThrob ${1.0 - distractionIntensity * 0.5}s ease-in-out infinite`
                  : "none",
            transform: isPanicking ? "scale(1.05)" : "scale(1)",
            margin: "12px 0 24px 0",
            position: "relative",
            zIndex: 2,
          }}
          onMouseEnter={(e) => {
            if (!isPanicking) e.currentTarget.style.background = "rgba(255,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            if (!isPanicking) e.currentTarget.style.background = "rgba(255,0,0,0.05)";
          }}
        >
          {getButtonText()}
        </button>

        <div style={{
          fontSize: "11px",
          letterSpacing: "0.5px",
          color: "#ff9999",
          textAlign: "center",
          lineHeight: "1.8",
          maxWidth: "380px",
          marginBottom: "16px",
          padding: "10px 14px",
          border: "1px solid rgba(255, 100, 100, 0.3)",
          borderRadius: "4px",
          background: "rgba(255, 0, 0, 0.06)",
        }}>
          <span style={{ color: "#ff4444", fontWeight: "bold", fontSize: "12px" }}>⚠ EPILEPSY WARNING</span><br />
          This action triggers intense flashing lights and rapid color shifts. Not recommended for individuals with photosensitive epilepsy.
        </div>

        {/* Distraction taunts */}
        {isDistracted && !isPanicking && !isDoomed && !hasPanicked && (
          <div style={{
            fontSize: "10px",
            letterSpacing: "3px",
            color: "#ff3333",
            textAlign: "center",
            marginBottom: "12px",
            animation: `distractTextFlicker ${0.8 - distractionIntensity * 0.4}s infinite`,
            textShadow: `0 0 ${8 + distractionIntensity * 12}px rgba(255,0,0,${0.3 + distractionIntensity * 0.4})`,
          }}>
            {distractionIntensity < 0.3
              ? "▶ PRESS ME INSTEAD..."
              : distractionIntensity < 0.6
                ? "▶▶ YOU KNOW YOU WANT TO..."
                : distractionIntensity < 0.85
                  ? "▶▶▶ STOP WASTING TIME OVER THERE"
                  : "⚠ LAST CHANCE — PRESS ME NOW ⚠"}
          </div>
        )}

        {hasPanicked && !isPanicking && (
          <div style={{
            padding: "16px",
            border: "1px solid rgba(57,255,20,0.4)",
            background: "rgba(57,255,20,0.08)",
            width: "100%",
            textAlign: "center",
            boxSizing: "border-box",
            color: "#39ff14",
            fontSize: "13px",
            letterSpacing: "0.5px",
            lineHeight: "1.6",
            animation: "fadeInTroll 0.4s ease-out forwards",
          }}>
            System stabilized. That achieved absolutely nothing. <br />
            <span style={{ opacity: 0.8, fontSize: "11px", marginTop: "8px", display: "inline-block" }}>
              Try something else.
            </span>
          </div>
        )}

      </div>
    </>
  );
}