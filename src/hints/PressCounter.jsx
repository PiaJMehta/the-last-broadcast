import { useEffect, useState, useRef } from "react";

const TARGET_PRESSES = 67;
const KEY_COUNT = "hint_press_counter_count";
const KEY_UNLOCKED = "hint_press_counter_unlocked";

const REWARD_TEXT =
  "REQUIREMENT: Add something completely unhinged and creative to your site. Make us laugh. Make us question reality. Points for commitment.";

export default function PressCounter() {
  const [count, setCount] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [bobPhase, setBobPhase] = useState(0);
  const animRef = useRef(null);
  const phaseOffsetRef = useRef(0);
  const lastCountRef = useRef(0);
  const [isBurning, setIsBurning] = useState(false);
  const [blackPause, setBlackPause] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [lastHand, setLastHand] = useState(null); // 'left' or 'right'
  const [wrongHand, setWrongHand] = useState(null); // flash feedback
  const containerRef = useRef(null);

  useEffect(() => {
    const savedCount = parseInt(localStorage.getItem(KEY_COUNT) || "0", 10);
    const savedUnlocked = localStorage.getItem(KEY_UNLOCKED) === "true";
    setCount(savedCount);
    if (savedUnlocked) {
      setUnlocked(true);
      setShowReward(true);
      setTypedText(REWARD_TEXT);
      setTypingDone(true);
    }
  }, []);

  // Continuous bob animation — speed increases with count, no reset on click
  useEffect(() => {
    if (unlocked || blackPause) return;
    // Accumulate phase so we don't snap back on count change
    phaseOffsetRef.current = bobPhase;
    let start = performance.now();
    const speed = 0.8 + (count / TARGET_PRESSES) * 1.2; // 0.8 → 2 Hz
    const animate = (now) => {
      const elapsed = (now - start) / 1000;
      setBobPhase(phaseOffsetRef.current + elapsed * speed * Math.PI * 2);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [count, unlocked, blackPause]); // eslint-disable-line react-hooks/exhaustive-deps



  // Black pause -> then typewriter reveal
  useEffect(() => {
    if (!blackPause) return;
    const timer = setTimeout(() => {
      setBlackPause(false);
      setUnlocked(true);
      localStorage.setItem(KEY_UNLOCKED, "true");
      setShowReward(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [blackPause]);

  // Typewriter effect
  useEffect(() => {
    if (!showReward || typingDone) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedText(REWARD_TEXT.slice(0, i));
      if (i >= REWARD_TEXT.length) {
        clearInterval(interval);
        setTypingDone(true);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [showReward, typingDone]);

  const handlePress = (hand) => {
    if (unlocked || blackPause || isBurning) return;

    // Must alternate hands
    if (lastHand === hand) {
      setWrongHand(hand);
      setTimeout(() => setWrongHand(null), 300);
      return;
    }

    setLastHand(hand);
    const next = count + 1;
    setCount(next);

    localStorage.setItem(KEY_COUNT, String(next));

    if (next >= TARGET_PRESSES) {
      setIsBurning(true);
      setTimeout(() => {
        setIsBurning(false);
        setBlackPause(true);
      }, 500);
    }
  };

  // Hand box bob offset — continuous sin wave
  const progress = Math.min(count / TARGET_PRESSES, 1);
  const bobOffset = Math.sin(bobPhase) * (25 + progress * 20); // grows from 25px to 45px

  // Shake — starts at 40
  const shakeIntensity = Math.min(count / TARGET_PRESSES, 1);
  const shouldShake = count > 40 && !unlocked && !blackPause;

  // Color progression — no effects before 40
  const getBodyColor = () => {
    if (count >= 55) return '#ff2a1f';
    if (count >= 40) return Math.sin(bobPhase) > 0 ? '#ff2a1f' : '#39ff14'; // flickers 40-54
    return '#39ff14';
  };
  const bodyColor = getBodyColor();
  const scannerColor = count >= 55 ? 'rgba(255,42,31,0.2)' : (count >= 40 ? (Math.sin(bobPhase) > 0 ? 'rgba(255,42,31,0.2)' : 'rgba(57,255,20,0.2)') : 'rgba(57,255,20,0.15)');

  // Emoji tint filter — green terminal glow, shifts to red
  const greenTint = "grayscale(1) brightness(0.45) sepia(1) hue-rotate(90deg) saturate(5)";
  const redTint = "grayscale(1) brightness(0.45) sepia(1) hue-rotate(320deg) saturate(5)";
  const getEmojiFilter = () => {
    if (count >= 55) return redTint;
    if (count >= 40) return Math.sin(bobPhase) > 0 ? redTint : greenTint;
    return greenTint;
  };
  const emojiFilter = getEmojiFilter();

  // Flashing speed: starts at 50, maxes out near 65
  const shouldFlash = count >= 50 && !unlocked && !blackPause;
  const flashSpeed = shouldFlash
    ? Math.max(0.12, 1.2 - ((count - 50) / 15) * 1.08)
    : 0;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Bebas+Neue&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes mildShake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-2px, 1px); }
          50% { transform: translate(2px, -1px); }
          75% { transform: translate(-1px, -1px); }
        }
        @keyframes heavyShake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-4px, -3px) rotate(-2deg); }
          20% { transform: translate(-3px, 0px) rotate(2deg); }
          30% { transform: translate(4px, 3px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(2deg); }
          50% { transform: translate(-1px, 3px) rotate(-2deg); }
          60% { transform: translate(-4px, 1px) rotate(0deg); }
          70% { transform: translate(4px, 1px) rotate(-2deg); }
          80% { transform: translate(-1px, -1px) rotate(2deg); }
          90% { transform: translate(1px, 3px) rotate(0deg); }
          100% { transform: translate(1px, -3px) rotate(-2deg); }
        }
        @keyframes fadeInHint {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes staticFlicker {
          0%, 100% { opacity: 0.8; }
          30% { opacity: 0.5; }
          60% { opacity: 0.9; }
          80% { opacity: 0.4; }
        }
        @keyframes scanline {
          0% { transform: translateY(-60px); }
          100% { transform: translateY(340px); }
        }
        @keyframes bodyGlitch {
          0%, 40%, 60%, 100% { filter: none; }
          45% { filter: hue-rotate(180deg) brightness(1.5); }
          55% { filter: hue-rotate(90deg) brightness(0.8); }
        }
        @keyframes redFlash {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        @keyframes burnFlash {
          0% { box-shadow: inset 0 0 0px #ff2a1f; background: rgba(255,42,31,0); }
          40% { box-shadow: inset 0 0 150px #ff2a1f; background: rgba(255,42,31,0.5); }
          100% { box-shadow: inset 0 0 300px #000; background: #000; }
        }
        @keyframes figureMelt {
          0% { filter: blur(0px) contrast(100%); transform: scale(1) skewX(0); opacity: 1; }
          50% { filter: blur(4px) contrast(300%) sepia(100%) hue-rotate(-50deg); transform: scale(1.1) skewX(10deg); opacity: 0.8; }
          100% { filter: blur(15px) contrast(500%) sepia(100%) hue-rotate(-50deg); transform: scale(1.3) skewX(-20deg) translateY(20px); opacity: 0; }
        }
        @keyframes redVignettePulse {
          0%, 100% { 
            box-shadow: inset 0 0 60px rgba(139,0,0,0.15), inset 0 0 120px rgba(139,0,0,0.05);
          }
          50% { 
            box-shadow: inset 0 0 80px rgba(139,0,0,0.3), inset 0 0 160px rgba(139,0,0,0.1);
          }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      <div
        ref={containerRef}
        style={{
          width: "100%",
          background: blackPause ? "#000" : "#070707",
          color: "#808080",
          fontFamily: "'Share Tech Mono', monospace",
          padding: "24px",
          position: "relative",
          border: `1px solid ${unlocked ? 'rgba(139,0,0,0.3)' : 'rgba(57,255,20,0.12)'}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxSizing: "border-box",
          overflow: "hidden",
          transition: "background 0.08s ease-in-out",
          // Red vignette when unlocked
          animation: unlocked ? "redVignettePulse 3s ease-in-out infinite" : "none",
        }}
      >
        {/* HEADER */}
        {!blackPause && (
          <div
            style={{
              width: "100%",
              fontSize: "9px",
              letterSpacing: "4px",
              color: "#2a2a2a",
              marginBottom: "18px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            UNKNOWN SIGNAL INTERCEPT
            <div style={{ flex: 1, height: "1px", background: "#1e1e1e" }} />
          </div>
        )}

        {/* STATUS */}
        {!blackPause && (
          <div style={{ width: "100%", marginBottom: "16px" }}>
            <div
              style={{
                fontSize: "11px",
                color: unlocked ? "#ff2a1f" : "#484848",
                letterSpacing: "0.04em",
                lineHeight: "2",
                minHeight: "16px",
              }}
            >
              {unlocked
                ? "☠ SIGNAL TERMINATED"
                : blackPause
                  ? "!! SIGNAL OVERLOAD !!"
                  : "Feed corrupted. Manual rhythm calibration required."}
            </div>
          </div>
        )}

        {/* EMOJI HANDS LAYOUT */}
        {!unlocked && (
          <div
            style={{
              position: "relative",
              width: "300px",
              minHeight: "260px",
              animation: isBurning
                ? 'heavyShake 0.08s infinite'
                : shouldShake
                  ? `mildShake ${0.3 - shakeIntensity * 0.2}s infinite`
                  : "none",
              userSelect: "none",
              outline: "none",
              opacity: blackPause ? 0 : 1,
              transition: "opacity 0.08s ease-in-out",
            }}
          >
            {/* Static noise overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(57,255,20,0.08) 3px, rgba(57,255,20,0.08) 4px)",
                opacity: Math.max(0, 1 - count / TARGET_PRESSES),
                animation: "staticFlicker 0.15s infinite",
                pointerEvents: "none",
                zIndex: 2,
                borderRadius: "4px",
              }}
            />

            {/* Scanline */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "15%",
                background: `linear-gradient(to bottom, transparent, ${scannerColor}, transparent)`,
                animation: "scanline 2.5s linear infinite",
                pointerEvents: "none",
                zIndex: 3,
                transition: "background 0.06s ease-in-out",
              }}
            />

            {/* Red flash overlay — 50+ */}
            {shouldFlash && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(circle at center, rgba(255,0,0,0.25) 0%, rgba(139,0,0,0.15) 60%, transparent 100%)",
                  animation: `redFlash ${flashSpeed}s ease-in-out infinite`,
                  pointerEvents: "none",
                  zIndex: 6,
                  borderRadius: "4px",
                }}
              />
            )}

            {/* Burn-in flash overlay */}
            {isBurning && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  animation: "burnFlash 0.5s ease-out forwards",
                  zIndex: 10,
                  pointerEvents: "none",
                  borderRadius: "4px",
                }}
              />
            )}

            {/* Split counter digits + hand boxes + shrug */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: "0px",
              position: "relative",
              zIndex: 5,
              width: "100%",
            }}>
              {/* Left column: tens digit + hand */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                {/* Tens digit — fixed */}
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "44px",
                  color: bodyColor,
                  letterSpacing: "2px",
                  textShadow: count >= 55 ? "0 0 10px rgba(255,42,31,0.5)" : "0 0 10px rgba(57,255,20,0.3)",
                  marginBottom: "8px",
                  display: "block",
                  textAlign: "center",
                  minWidth: "40px",
                }}>
                  {String(count).padStart(2, '0')[0]}
                </span>
                {/* Left hand box */}
                <button
                  onClick={() => handlePress('left')}
                  style={{
                    width: "100%",
                    height: "90px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "40px",
                    background: wrongHand === 'left' ? "rgba(255,42,31,0.25)" : (count >= 55 ? "rgba(255,42,31,0.08)" : "rgba(57,255,20,0.06)"),
                    border: `2px solid ${wrongHand === 'left' ? '#ff0000' : bodyColor}`,
                    borderRadius: "8px",
                    cursor: blackPause ? "default" : "pointer",
                    transform: `translateY(${bobOffset}px) scaleX(-1)`,
                    boxShadow: `0 0 ${8 + Math.abs(bobOffset) * 0.5}px ${bodyColor}33`,
                    outline: "none",
                    padding: 0,
                    filter: emojiFilter,
                    transition: "background 0.15s, border-color 0.15s",
                  }}
                  aria-label="Left hand - click to count"
                >
                  🫴🏻
                </button>
              </div>

              {/* Shrug emoji — centered between */}
              <div style={{
                fontSize: "42px",
                lineHeight: 1,
                padding: "0 10px",
                flexShrink: 0,
                filter: emojiFilter,
                animation: isBurning ? 'figureMelt 0.5s forwards' : 'none',
                alignSelf: "center",
                marginTop: "40px",
              }}>
                🤷‍♂️
              </div>

              {/* Right column: ones digit + hand */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                {/* Ones digit — fixed */}
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "44px",
                  color: bodyColor,
                  letterSpacing: "2px",
                  textShadow: count >= 55 ? "0 0 10px rgba(255,42,31,0.5)" : "0 0 10px rgba(57,255,20,0.3)",
                  marginBottom: "8px",
                  display: "block",
                  textAlign: "center",
                  minWidth: "40px",
                }}>
                  {String(count).padStart(2, '0')[1]}
                </span>
                {/* Right hand box */}
                <button
                  onClick={() => handlePress('right')}
                  style={{
                    width: "100%",
                    height: "90px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "40px",
                    background: wrongHand === 'right' ? "rgba(255,42,31,0.25)" : (count >= 55 ? "rgba(255,42,31,0.08)" : "rgba(57,255,20,0.06)"),
                    border: `2px solid ${wrongHand === 'right' ? '#ff0000' : bodyColor}`,
                    borderRadius: "8px",
                    cursor: blackPause ? "default" : "pointer",
                    transform: `translateY(${-bobOffset}px)`,
                    boxShadow: `0 0 ${8 + Math.abs(bobOffset) * 0.5}px ${bodyColor}33`,
                    outline: "none",
                    padding: 0,
                    filter: emojiFilter,
                    transition: "background 0.15s, border-color 0.15s",
                  }}
                  aria-label="Right hand - click to count"
                >
                  🫴🏻
                </button>
              </div>
            </div>


          </div>
        )}

        {/* BLACK PAUSE — empty void after explosion */}
        {blackPause && (
          <div style={{
            height: "280px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{
              width: "4px",
              height: "4px",
              background: "#ff2a1f",
              borderRadius: "50%",
              animation: "cursorBlink 0.8s step-end infinite",
              boxShadow: "0 0 8px #ff2a1f",
            }} />
          </div>
        )}

        {/* THE REWARD — typewriter reveal with red vignette */}
        {showReward && (
          <div style={{
            border: "1px solid #8b0000",
            padding: "20px",
            width: "100%",
            boxSizing: "border-box",
            background: "rgba(139,0,0,0.05)",
            animation: "fadeInHint 0.6s ease both",
            position: "relative",
          }}>
            {/* Red scanline on reward */}
            <div style={{
              position: "absolute",
              top: 0, left: 0, right: 0, height: "20%",
              background: "linear-gradient(to bottom, transparent, rgba(139,0,0,0.15), transparent)",
              animation: "scanline 4s linear infinite",
              pointerEvents: "none",
            }} />

            <div style={{
              fontSize: "10px",
              color: "#ff2a1f",
              letterSpacing: "2px",
              marginBottom: "12px",
            }}>
              ☠ SIGNAL TERMINATED
            </div>
            <div style={{
              fontSize: "12px",
              color: "#808080",
              lineHeight: "1.9",
              minHeight: "46px",
            }}>
              {typedText}
              {!typingDone && (
                <span style={{
                  color: "#ff2a1f",
                  animation: "cursorBlink 0.6s step-end infinite",
                  marginLeft: "2px",
                }}>▌</span>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}