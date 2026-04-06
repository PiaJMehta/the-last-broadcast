import { useState } from "react";

const riddles = [
  {
    question:
      "In a blackout or apocalypse, I am the handheld source of light people use to see in the dark. What am I?",
    answer: "torch",
  },
  {
    question:
      "I warn people before danger, disaster, or evacuation. I am loud and often red. What am I?",
    answer: "alarm",
  },
  {
    question:
      "I help people find locations, roads, and places during survival or travel. What am I?",
    answer: "map",
  },
  {
    question:
      "I carry radio waves, messages, and communication through the air, but I cannot be seen. What am I?",
    answer: "signal",
  },
  {
    question:
      "I am the final transmission sent out to everyone before everything goes silent. What am I?",
    answer: "broadcast",
  },
];

export default function TrollRiddles() {
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const handleSubmit = () => {
    const userAnswer = input.trim().toLowerCase();
    const correctAnswer = riddles[current].answer.toLowerCase();

    if (
      userAnswer === correctAnswer ||
      userAnswer.includes(correctAnswer) ||
      correctAnswer.includes(userAnswer)
    ) {
      setError("");
      setInput("");

      if (current === riddles.length - 1) {
        setUnlocked(true);
      } else {
        setCurrent((prev) => prev + 1);
      }
    } else {
      setError("Transmission rejected. Try again.");
    }
  };

  const progress = ((current + (unlocked ? 1 : 0)) / riddles.length) * 100;

  return (
    <div className="w-full bg-black text-green-400 px-6 py-8 font-mono relative overflow-hidden border border-green-900/30">
      <div className="pointer-events-none absolute inset-0 opacity-10 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,255,0,0.08)_51%)] bg-[length:100%_4px]" />

      <div className="pointer-events-none absolute top-0 left-1/2 h-full w-px bg-green-500/15" />
      <div className="pointer-events-none absolute top-20 left-0 w-full h-px bg-green-500/15" />
      <div className="pointer-events-none absolute bottom-16 left-0 w-full h-px bg-green-500/15" />

      <div className="relative z-10 max-w-[900px] mx-auto">
        <div className="text-[10px] tracking-[0.45em] text-green-500/30 mb-6 flex items-center gap-3">
          ENCRYPTED ACCESS CHALLENGE
          <div className="flex-1 h-px bg-zinc-900" />
        </div>

        {!unlocked ? (
          <>
            <p className="text-sm text-green-500/40 mb-3 tracking-widest uppercase">
              Solve this riddle
            </p>

            <div className="border border-green-900/40 bg-green-500/5 px-5 py-6 text-lg leading-8 mb-5 min-h-[100px]">
              {riddles[current].question}
            </div>

            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="TYPE YOUR ANSWER..."
                className="flex-1 bg-black border border-zinc-800 focus:border-green-500 outline-none px-4 py-3 text-green-400 tracking-wider uppercase"
              />

              <button
                onClick={handleSubmit}
                className="border border-green-500/40 px-6 py-3 hover:bg-green-500/10 transition tracking-widest"
              >
                SUBMIT
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-sm mb-4 tracking-wide">{error}</p>
            )}

            <div className="mb-2 flex justify-between text-[10px] tracking-[0.3em] text-green-500/35 uppercase">
              <span>DECRYPTION PROGRESS</span>
              <span>{Math.round(progress)}%</span>
            </div>

            <div className="w-full h-[2px] bg-zinc-900">
              <div
                className="h-full bg-green-400 shadow-[0_0_8px_#39ff14] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        ) : (
          <div className="border border-green-700 bg-green-500/5 p-8 flex flex-col items-center text-center gap-6">
            <p className="text-xl text-green-400 tracking-wider">
              ACCESS GRANTED
            </p>

            <p className="text-green-500/60 leading-7 text-sm max-w-[520px]">
              Hidden transmission located.<br />
              A classified signal has been isolated.<br />
              You may now unlock the final archive.
            </p>

            <div className="w-full h-px bg-green-900/40" />

            <button
              onClick={() => setShowVideo(true)}
              className="border border-green-500 px-10 py-3 hover:bg-green-500/10 transition tracking-[0.4em] text-sm"
            >
              UNLOCK
            </button>
          </div>
        )}

        {showVideo && (
          <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center px-4">
            <div className="relative w-full max-w-4xl border border-green-500/40 bg-black shadow-[0_0_30px_rgba(57,255,20,0.08)] p-4">
              <div className="flex items-center justify-between mb-3 border-b border-green-900/40 pb-3">
                <p className="text-green-400 text-xs tracking-[0.35em] uppercase">
                  Recovered Emergency Transmission
                </p>

                <button
                  onClick={() => setShowVideo(false)}
                  className="text-green-500/60 hover:text-green-400 transition text-sm tracking-widest"
                >
                  CLOSE
                </button>
              </div>

              <div className="aspect-video w-full border border-green-900/30">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="Never Gonna Give You Up"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}