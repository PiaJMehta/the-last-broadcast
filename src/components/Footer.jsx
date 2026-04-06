import React from 'react';

const Footer = () => {
  return (
    <footer className="px-10 py-12 border-t border-green-900/30 mt-10">
      <div className="flex justify-between items-end opacity-40 hover:opacity-100 transition-opacity">
        
        {/* LEFT SIDE */}
        <div>
          <p className="text-xs font-bold">© IEEE TECH WEEK - WEB DEV EVENT</p>
          <p className="text-[9px] tracking-widest mt-1">
            THE LAST BROADCAST: BUILD. SURVIVE. DEPLOY.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex gap-6 items-center text-[9px]">
          
          <a href="#" className="hover:text-green-400 transition">
            HELP
          </a>

          {/* Hidden key stays untouched */}
          <a href="#" className="hover:text-white font-black select-none opacity-0">
            X7_SECRET_KEY
          </a>

          <a href="#" className="hover:text-green-400 transition">
            RESOURCES
          </a>

          {/* LOCATION LINK */}
          <a
            href="https://www.google.com/maps/place/Pixelify/@23.819631,90.3066935,19662m/data=!3m2!1e3!4b1!4m6!3m5!1s0x89abc830985e627f:0x341fbc30e214045e!8m2!3d23.8195442!4d90.4543555!16s%2Fg%2F11w22jn4k7?entry=ttu&g_ep=EgoyMDI2MDQwMS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-green-400 transition group"
            title="Last known signal origin"
          >
            {/* SVG MAP PIN ICON */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-3 h-3 text-green-500/40 group-hover:text-green-400 transition"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10z" />
              <circle cx="12" cy="11" r="2.5" />
            </svg>

            <span className="tracking-widest">STYLE</span>
          </a>

        </div>
      </div>
    </footer>
  );
};

export default Footer;