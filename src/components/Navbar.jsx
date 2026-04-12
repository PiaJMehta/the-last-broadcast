import React from 'react';

const Navbar = ({ setView }) => {
  const handleNav = (target) => {
    setView(target);
    window.scrollTo(0, 0);
    const path = target === 'home' ? '/' : `/${target}`;
    window.history.pushState({ view: target }, '', path);
  };

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-10 py-4 text-[10px] border-b border-green-900/30 bg-black/90 backdrop-blur-sm">
      <div
        className="flex items-center gap-4 cursor-pointer group"
        onClick={() => handleNav('home')}
      >
        <span className="text-green-500 font-bold group-hover:animate-pulse">● THE LAST BROADCAST</span>
        <span className="opacity-40 hidden sm:inline tracking-tighter">DAY ONE OF UNKNOWN</span>
      </div>
      <div className="flex gap-10 opacity-60">
        <button
          onClick={() => handleNav('rules')}
          className="hover:text-green-400 hover:underline transition-colors uppercase font-bold"
        >
          RULES
        </button>
        <button
          onClick={() => handleNav('logs')}
          className="hover:text-green-400 hover:underline transition-colors uppercase font-bold"
        >
          LOGS
        </button>

        <button
          onClick={() => {
            setView('home');
            window.history.pushState({ view: 'home' }, '', '/');
            setTimeout(() => {
              const el = document.getElementById('map-sector');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          className="hover:text-green-400 hover:underline transition-colors uppercase font-bold"
        >
          MAP
        </button>
      </div>
      <div className="text-green-500 font-bold tracking-widest hidden xs:block">
        501.5 MHz
      </div>
    </nav>
  );
};

export default Navbar;