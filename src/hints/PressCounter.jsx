import { useEffect, useState } from "react";

const TARGET_PRESSES = 67;
const KEY_COUNT = "hint_press_counter_count";
const KEY_UNLOCKED = "hint_press_counter_unlocked";

export default function PressCounter() {
  const [count, setCount] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const savedCount = parseInt(localStorage.getItem(KEY_COUNT) || "0", 10);
    const savedUnlocked = localStorage.getItem(KEY_UNLOCKED) === "true";
    setCount(savedCount);
    setUnlocked(savedUnlocked);
  }, []);

  const handlePress = () => {
    if (unlocked) return;
    const next = count + 1;
    setCount(next);
    localStorage.setItem(KEY_COUNT, String(next));

    if (next >= TARGET_PRESSES) {
      setUnlocked(true);
      localStorage.setItem(KEY_UNLOCKED, "true");
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Bebas+Neue&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          width: "100%",
          background: "#070707",
          color: "#808080",
          fontFamily: "'Share Tech Mono', monospace",
          padding: "24px",
          position: "relative",
          border: "1px solid rgba(57,255,20,0.12)",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            fontSize: "9px",
            letterSpacing: "4px",
            color: "#2a2a2a",
            marginBottom: "18px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          SIGNAL AMPLIFIER
          <div style={{ flex: 1, height: "1px", background: "#1e1e1e" }} />
        </div>

        <div style={{ marginBottom: "18px" }}>
          <div
            style={{
              fontSize: "11px",
              color: "#39ff14",
              letterSpacing: "0.04em",
              lineHeight: "2",
              fontFamily: "'Share Tech Mono', monospace",
            }}
          >
            "The signal needs amplification."
          </div>
        </div>

        <div
          style={{
            fontSize: "11px",
            color: unlocked ? "#39ff14" : "#484848",
            marginBottom: "18px",
            minHeight: "16px",
          }}
        >
          {unlocked ? "SIGNAL AMPLIFIED ✓" : ""}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "42px",
            paddingBottom: "52px",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={handlePress}
              disabled={unlocked}
              style={{
                background: "transparent",
                border: "1px solid",
                borderColor: unlocked ? "#1c7a08" : "#1e1e1e",
                fontSize: "26px",
                width: "52px",
                height: "52px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: unlocked ? "default" : "crosshair",
                transition: "border-color .2s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (!unlocked) e.currentTarget.style.borderColor = "#39ff14";
              }}
              onMouseLeave={(e) => {
                if (!unlocked) e.currentTarget.style.borderColor = "#1e1e1e";
              }}
            >
              🫳
            </button>

            <button
              onClick={handlePress}
              disabled={unlocked}
              style={{
                background: "transparent",
                border: "1px solid",
                borderColor: unlocked ? "#1c7a08" : "#1e1e1e",
                fontSize: "26px",
                width: "52px",
                height: "52px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: unlocked ? "default" : "crosshair",
                transition: "border-color .2s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (!unlocked) e.currentTarget.style.borderColor = "#39ff14";
              }}
              onMouseLeave={(e) => {
                if (!unlocked) e.currentTarget.style.borderColor = "#1e1e1e";
              }}
            >
              🫴
            </button>

            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "42px",
                color: unlocked ? "#39ff14" : "#2a2a2a",
                letterSpacing: "2px",
                lineHeight: 1,
                transition: "color .3s",
                minWidth: "72px",
                textAlign: "center",
              }}
            >
              {count}
            </div>
          </div>
        </div>

        {unlocked && (
          <div style={{ border: "1px solid #1c7a08", padding: "14px 16px", marginTop: "auto" }}>
            <div style={{ fontSize: "12px", color: "#39ff14", lineHeight: "1.9" }}>
              REQUIREMENT: Add something completely unhinged and creative to your site.
              Make us laugh. Make us question reality. Points for commitment.
            </div>
          </div>
        )}
      </div>
    </>
  );
}