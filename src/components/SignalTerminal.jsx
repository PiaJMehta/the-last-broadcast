import { useState } from 'react';

// ALPHA: the data-key-alpha attribute value found in DevTools Elements
const CORRECT_ALPHA = "2f";


const CORRECT_BRAVO = "RlJBR01FTlRfQlJBVk86OkxldF90aGVfd29ybGRfa25vd190aGF0X3RpbWVfaXNfcnVubmluZ19vdXQ=";

// CHARLIE: the raw SYS_FRAGMENT_PROFILE localStorage value found in DevTools Application → Local Storage
// (participants paste it into atob() in console and see FRAGMENT_CHARLIE in the decoded text)
const CORRECT_CHARLIE = "RlJBR01FTlRfQ0hBUkxJRTo6QWRkX3dob195b3VfY2xhaW1fdG9fYmU=";

const DECRYPTED_CLUE = "IMPLEMENT: EVIDENCE MUST BE DISPLAYED";

export default function SignalTerminal() {
  const [inputs, setInputs] = useState({ alpha: '', bravo: '', charlie: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({ alpha: false, bravo: false, charlie: false });
  const [unlocked, setUnlocked] = useState(false);

  const handleSubmit = () => {
    const newErrors = {
      alpha: inputs.alpha.trim() !== CORRECT_ALPHA,
      bravo: inputs.bravo.trim() !== CORRECT_BRAVO,
      charlie: inputs.charlie.trim() !== CORRECT_CHARLIE,
    };
    setErrors(newErrors);
    setSubmitted(true);

    if (!newErrors.alpha && !newErrors.bravo && !newErrors.charlie) {
      setUnlocked(true);
    }
  };

  const fields = [
    { key: 'alpha', label: 'FRAGMENT_ALPHA' },
    { key: 'bravo', label: 'FRAGMENT_BRAVO' },
    { key: 'charlie', label: 'FRAGMENT_CHARLIE' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-10 py-16 font-mono">
      <div className="text-[10px] tracking-widest opacity-40 mb-2">// XOR_SIGNAL_TERMINAL</div>
      <div className="text-[10px] tracking-widest opacity-20 mb-8">ENTER ALL THREE FRAGMENTS TO DECRYPT TRANSMISSION</div>

      <div className="border border-green-900/30 p-6 bg-black/60 space-y-6">

        {/* ── DECODE INSTRUCTIONS ── */}
        <div className="border border-yellow-900 bg-yellow-950/30 p-4">
          <div className="text-yellow-500 text-[9px] tracking-widest font-bold mb-2">
            ⚠ SIGNAL_DECODE_INSTRUCTIONS
          </div>
          <div className="text-yellow-700 text-[10px] leading-relaxed tracking-wide space-y-1">
            <p>PASTE THE RAW COOKIE / LOCALSTORAGE VALUE AS-IS INTO EACH FIELD</p>
            <p>EACH VALUE CONTAINS TWO PARTS SEPARATED BY <span className="text-yellow-400 font-bold">::</span></p>
            <p>PART 1 → FRAGMENT IDENTIFIER — used to verify this terminal</p>
            <p>PART 2 → A BUILD INSTRUCTION — implement this in your submission</p>
          </div>
        </div>

        {fields.map(({ key, label, hint, placeholder }) => (
          <div key={key}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] tracking-widest text-green-500">{label}</span>
              <span className="text-[9px] text-green-900/60">{hint}</span>
            </div>
            <input
              type="text"
              value={inputs[key]}
              onChange={(e) => {
                setInputs({ ...inputs, [key]: e.target.value });
                setSubmitted(false);
                setUnlocked(false);
                setErrors({ ...errors, [key]: false });
              }}
              placeholder={placeholder}
              className={`w-full bg-black border p-3 text-green-400 text-[11px] tracking-wider outline-none transition-colors ${
                submitted
                  ? errors[key]
                    ? 'border-red-700'
                    : 'border-green-700'
                  : 'border-green-900/30 focus:border-green-700'
              }`}
            />
            {submitted && errors[key] && (
              <div className="text-red-500 text-[9px] tracking-widest mt-1">✗ INCORRECT FRAGMENT</div>
            )}
            {submitted && !errors[key] && (
              <div className="text-green-500 text-[9px] tracking-widest mt-1">✓ FRAGMENT VERIFIED</div>
            )}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="w-full border border-green-500/40 py-3 text-[10px] tracking-widest hover:bg-green-500/10 transition text-green-400"
        >
          DECRYPT TRANSMISSION
        </button>

        {unlocked && (
          <div className="border border-green-500 p-6 bg-green-500/5 mt-4">
            <div className="text-[9px] tracking-widest text-green-900 mb-3">
              ✓ ALL FRAGMENTS VERIFIED — TRANSMISSION DECRYPTED
            </div>
            <div className="text-green-400 text-sm tracking-widest animate-pulse">
              {DECRYPTED_CLUE}
            </div>
          </div>
        )}

        {submitted && !unlocked && (
          <div className="text-red-500 text-[9px] tracking-widest text-center">
            ✗ DECRYPTION FAILED — ONE OR MORE FRAGMENTS INCORRECT
          </div>
        )}

      </div>
    </div>
  );
}