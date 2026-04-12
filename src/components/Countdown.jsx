import React, { useState, useEffect } from 'react';

const Countdown = () => {
  const targetDate = new Date('2026-04-12T09:00:00').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00"
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days: String(d).padStart(2, '0'),
          hours: String(h).padStart(2, '0'),
          minutes: String(m).padStart(2, '0'),
          seconds: String(s).padStart(2, '0')
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  useEffect(() => {
    // When participants find this cookie and run atob() on it in the console,
    // they will see "FRAGMENT_BRAVO" telling them this is the BRAVO fragment
    // for the Signal terminal puzzle.
    const payload = `FRAGMENT_BRAVO::Let_the_world_know_that_time_is_running_out (Implement)`;
    const encoded = btoa(payload);
    document.cookie = `vault_clue=${encoded}; path=/; max-age=31536000`;
  }, []);

  const displayData = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HRS", value: timeLeft.hours },
    { label: "MIN", value: timeLeft.minutes },
    { label: "SEC", value: timeLeft.seconds },
  ];

  return (
    <div className='flex flex-col gap-2 justify-center items-center py-4'>
      <div className="flex gap-2 justify-center py-4">
        {displayData.map((item, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="text-4xl font-bold px-3 py-2 bg-green-500/10 border border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.2)] text-green-500">
              {item.value}
            </div>
            <span className="text-[8px] mt-1 opacity-50 font-bold tracking-tighter">
              {item.label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-center text-[10px] opacity-10 animation-pulse font-bold tracking-widest animate-pulse">
        H4WVEMCUIMZVGL27FVPT6X2LIMYVAX2EJRKTAV27GRGDISCU <br />
        What’s uncovered must face the other way.

      </p>
    </div>
  );
};

export default Countdown;