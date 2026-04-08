import { useEffect, useState } from "react";

const TARGET = "INSTA";
const MAX_ROWS = 6;
const MAX_COLS = 5;
const STORAGE_KEY = "wordle_progress_v2";

const keyboardRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["↵", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

function getGuessStatus(guess, target) {
  const result = Array(MAX_COLS).fill("absent");
  const targetArr = target.split("");
  const guessArr = guess.split("");

  for (let i = 0; i < MAX_COLS; i++) {
    if (guessArr[i] === targetArr[i]) {
      result[i] = "correct";
      targetArr[i] = null;
      guessArr[i] = null;
    }
  }

  for (let i = 0; i < MAX_COLS; i++) {
    if (guessArr[i] && targetArr.includes(guessArr[i])) {
      result[i] = "present";
      targetArr[targetArr.indexOf(guessArr[i])] = null;
    }
  }

  return result;
}

function buildKeyStates(guesses, statuses) {
  const priority = { correct: 3, present: 2, absent: 1 };
  const states = {};

  guesses.forEach((guess, rowIndex) => {
    if (!statuses[rowIndex]) return;

    guess.split("").forEach((letter, colIndex) => {
      const status = statuses[rowIndex][colIndex];
      if (!states[letter] || priority[status] > priority[states[letter]]) {
        states[letter] = status;
      }
    });
  });

  return states;
}

export default function Wordle() {
  const [guesses, setGuesses] = useState(Array(MAX_ROWS).fill(""));
  const [statuses, setStatuses] = useState(Array(MAX_ROWS).fill(null));
  const [currentRow, setCurrentRow] = useState(0);
  const [currentGuess, setCurrentGuess] = useState("");
  const [solved, setSolved] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [keyStates, setKeyStates] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        const loadedGuesses = parsed.guesses || Array(MAX_ROWS).fill("");
        const loadedStatuses = parsed.statuses || Array(MAX_ROWS).fill(null);

        setGuesses(loadedGuesses);
        setStatuses(loadedStatuses);
        setCurrentRow(parsed.currentRow ?? 0);
        setCurrentGuess(parsed.currentGuess ?? "");
        setSolved(parsed.solved ?? false);
        setGameOver(parsed.gameOver ?? false);
        setKeyStates(buildKeyStates(loadedGuesses, loadedStatuses));
      } catch (err) {
        console.error("Failed to load Wordle progress:", err);
      }
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const progress = {
      guesses,
      statuses,
      currentRow,
      currentGuess,
      solved,
      gameOver,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [guesses, statuses, currentRow, currentGuess, solved, gameOver, loaded]);

  const updateKeyStates = (guess, guessStatus) => {
    const priority = { correct: 3, present: 2, absent: 1 };
    const next = { ...keyStates };

    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      const status = guessStatus[i];
      if (!next[letter] || priority[status] > priority[next[letter]]) {
        next[letter] = status;
      }
    }

    setKeyStates(next);
  };

  const submitGuess = () => {
    if (currentGuess.length !== MAX_COLS || gameOver) return;

    const guessStatus = getGuessStatus(currentGuess, TARGET);
    const newGuesses = [...guesses];
    const newStatuses = [...statuses];

    newGuesses[currentRow] = currentGuess;
    newStatuses[currentRow] = guessStatus;

    setGuesses(newGuesses);
    setStatuses(newStatuses);
    updateKeyStates(currentGuess, guessStatus);

    if (currentGuess === TARGET) {
      setSolved(true);
      setGameOver(true);
      return;
    }

    if (currentRow === MAX_ROWS - 1) {
      setGameOver(true);
      return;
    }

    setCurrentRow((prev) => prev + 1);
    setCurrentGuess("");
  };

  const handleKey = (key) => {
    if (gameOver) return;

    if (key === "⌫") {
      setCurrentGuess((prev) => prev.slice(0, -1));
      return;
    }

    if (key === "↵") {
      submitGuess();
      return;
    }

    if (/^[A-Z]$/.test(key) && currentGuess.length < MAX_COLS) {
      setCurrentGuess((prev) => prev + key);
    }
  };

  // useEffect(() => {
  //   const onKeyDown = (e) => {
  //     if (e.key === "Backspace") return handleKey("⌫");
  //     if (e.key === "Enter") return handleKey("↵");

  //     const key = e.key.toUpperCase();
  //     if (/^[A-Z]$/.test(key)) handleKey(key);
  //   };

  //   window.addEventListener("keydown", onKeyDown);
  //   return () => window.removeEventListener("keydown", onKeyDown);
  // }, [currentGuess, gameOver, currentRow, guesses]);

  const getCellContent = (row, col) => {
    if (guesses[row]) {
      return guesses[row][col] || "";
    }

    if (row === currentRow && !gameOver) {
      return currentGuess[col] || "";
    }

    return "";
  };

  const getCellStatus = (row, col) => {
    return statuses[row]?.[col] ?? null;
  };

  const cellStyle = (status, filled) => {
    const base = {
      width: "48px",
      height: "48px",
      border: "1px solid",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "19px",
      fontFamily: "'Bebas Neue', sans-serif",
      letterSpacing: "1px",
      textTransform: "uppercase",
      transition: "background .3s, border-color .3s",
      flexShrink: 0,
    };

    if (status === "correct") {
      return { ...base, borderColor: "#39ff14", background: "rgba(57,255,20,.08)", color: "#39ff14" };
    }
    if (status === "present") {
      return { ...base, borderColor: "#c8a000", background: "rgba(200,160,0,.08)", color: "#c8a000" };
    }
    if (status === "absent") {
      return { ...base, borderColor: "#2a2a2a", background: "#111", color: "#2a2a2a" };
    }
    if (filled) {
      return { ...base, borderColor: "#2a2a2a", background: "transparent", color: "#b0b0b0" };
    }

    return { ...base, borderColor: "#1e1e1e", background: "transparent", color: "transparent" };
  };

  const keyStyle = (key) => {
    const status = keyStates[key];

    const base = {
      height: "32px",
      minWidth: key.length > 1 ? "42px" : "24px",
      padding: "0 6px",
      border: "1px solid",
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: "10px",
      cursor: "crosshair",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all .2s",
      background: "transparent",
      letterSpacing: "0px",
    };

    if (status === "correct") {
      return { ...base, borderColor: "#39ff14", background: "rgba(57,255,20,.08)", color: "#39ff14" };
    }
    if (status === "present") {
      return { ...base, borderColor: "#c8a000", background: "rgba(200,160,0,.08)", color: "#c8a000" };
    }
    if (status === "absent") {
      return { ...base, borderColor: "#2a2a2a", background: "#111", color: "#2a2a2a" };
    }

    return { ...base, borderColor: "#1e1e1e", color: "#484848" };
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
          minHeight: "100%",
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
          SIGNAL DECODE
          <div style={{ flex: 1, height: "1px", background: "#1e1e1e" }} />
        </div>

        <div
          style={{
            fontSize: "11px",
            color: solved ? "#39ff14" : gameOver ? "#ff2a1f" : "#39ff14",
            marginBottom: "18px",
            minHeight: "16px",
            textAlign: "left",
          }}
        >
          {solved ? "SIGNAL DECODED ✓" : gameOver ? "SIGNAL LOST." : ""}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            marginBottom: "18px",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {Array.from({ length: MAX_ROWS }).map((_, row) => (
            <div key={row} style={{ display: "flex", gap: "6px" }}>
              {Array.from({ length: MAX_COLS }).map((_, col) => {
                const cell = getCellContent(row, col);
                const status = getCellStatus(row, col);
                return (
                  <div key={col} style={cellStyle(status, cell !== "")}>
                    {cell}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            marginBottom: "18px",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {keyboardRows.map((row, i) => (
            <div key={i} style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center" }}>
              {row.map((key) => (
                <button
                  key={key}
                  onClick={() => handleKey(key)}
                  style={keyStyle(key)}
                  onMouseEnter={(e) => {
                    if (!keyStates[key]) e.currentTarget.style.borderColor = "#39ff14";
                  }}
                  onMouseLeave={(e) => {
                    if (!keyStates[key]) e.currentTarget.style.borderColor = "#1e1e1e";
                  }}
                >
                  {key}
                </button>
              ))}
            </div>
          ))}
        </div>

        {solved && (
          <div style={{ border: "1px solid #1c7a08", padding: "14px 16px", marginTop: "auto" }}>
            <div style={{ fontSize: "12px", color: "#39ff14", lineHeight: "1.9" }}>
              REQUIREMENT: Creatively incorporate something on your site that leads to your Instagram profile.
            </div>
          </div>
        )}

        {gameOver && !solved && (
          <div style={{ border: "1px solid #8b1a14", padding: "14px 16px", marginTop: "auto" }}>
            <div style={{ fontSize: "12px", color: "#ff2a1f", lineHeight: "1.9" }}>
              The signal is gone. This frequency is permanently dead.
            </div>
          </div>
        )}
      </div>
    </>
  );
}