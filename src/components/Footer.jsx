import React from 'react';

const Footer = () => {
  return (
    <footer className="px-10 py-12 border-t border-green-900/30 mt-10">
      <div className="flex justify-between items-end opacity-40 hover:opacity-100 transition-opacity">
        <div>
          <p className="text-xs font-bold">© IEEE TECH WEEK - WEB DEV EVENT</p>
          <p className="text-[9px] tracking-widest mt-1">THE LAST BROADCAST: BUILD. SURVIVE. DEPLOY.</p>
        </div>
        <div className="flex gap-4 text-[9px]">
          <a href="#" className="hover:text-white">HELP</a>
          <a href="#" className="hover:text-white font-black select-none opacity-0">X7_SECRET_KEY</a>
          <a href="#" className="hover:text-white">RESOURCES</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;