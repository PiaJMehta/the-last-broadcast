import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import MapDisplay from './components/MapDisplay';
import Rules from './components/Rules';
import SurvivalStatus from './components/SurvivalStatus';
import SystemLogs from './components/SystemLogs';
import ProfileCard from './components/SurvivalChances';
import Wordle from './hints/Wordle';
import PressCounter from './hints/PressCounter';
import TrollRiddles from './hints/TrollRiddles';
import Help from './components/Help'; 
import Resources from './components/Resources';
import Logs from './components/Logs';

function App() {
  const [view, setView] = useState('home');

  return (
    <div className="min-h-screen bg-[#050505] text-green-500 font-mono selection:bg-green-500 selection:text-black overflow-x-hidden scroll-smooth">
      <Navbar setView={setView} />

      <main className="relative pt-16">
        {view === 'home' ? (
          <>
            {/* 1. HERO SECTION */}
            <Hero />

            {/* 2. MAP SECTION */}
            <section className="max-w-7xl mx-auto px-10 py-20">
              <div id="map-sector" className="scroll-mt-24">
                <div className="flex justify-between items-end border-b border-green-900 pb-2 mb-4">
                  <h3 className="text-xl font-bold">
                    <span className="animate-pulse">●</span> // GLOBAL_SECTOR_SCANNER.EXE
                  </h3>
                  <span className="text-[10px] opacity-40">SIGNAL_STRENGTH: 45%</span>
                </div>

                <div className="glitch-border p-1 bg-green-500/5">
                  <MapDisplay />
                </div>

                <div className="flex justify-between mt-2 text-[10px] opacity-40 italic tracking-widest">
                  <span>[ COORDINATES: 12.9234° N, 77.5055° E ]</span>
                  <span>REF_FRAME: WGS-84</span>
                </div>
              </div>
            </section>

            {/* 3. SURVIVAL & SYSTEM LOGS SECTION */}
            <section className="max-w-7xl mx-auto px-10 pb-20 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold border-b border-green-900 pb-2">// SYSTEM_HEALTH</h3>
                <SurvivalStatus />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold border-b border-green-900 pb-2 text-right">// DATA_STREAM</h3>
                <SystemLogs />
              </div>
            </section>

            {/* 4. SURVIVAL CHANCES & RADAR SECTION - SIDE BY SIDE */}
            <section className="max-w-7xl mx-auto px-10 py-10">
               <div className="flex flex-col md:flex-row gap-6 items-stretch">
                  <div className="w-full md:w-1/2">
                    <ProfileCard />
                  </div>

                  <div className="w-full md:w-1/2 flex flex-col items-center justify-center border border-green-900/50 p-6 bg-green-900/5 relative overflow-hidden">
                    <div className="absolute top-2 left-4 text-[10px] uppercase tracking-tighter opacity-60">
                      // SCAN_TYPE: ORBITAL_RADAR
                    </div>
                    <img 
                      src="/radar.gif" 
                      alt="Radar Scan" 
                      className="w-full max-w-[400px] aspect-square object-contain opacity-80 mix-blend-screen sepia(100%) hue-rotate-[90deg] brightness(1.2)"
                    />
                    <div className="mt-4 text-[10px] font-bold text-green-800 animate-pulse tracking-[0.2em]">
                      SENSORS_DETECTING_METADATA_PACKETS...
                    </div>
                  </div>
               </div>
            </section>

            {/* 5. HINTS SECTION */}
            <section className="max-w-7xl mx-auto px-10 pt-16 pb-20">
              <div
                style={{
                  display: "flex",
                  gap: "32px",
                  marginBottom: "32px",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: "1.25", minWidth: "420px" }}>
                  <Wordle />
                </div>

                <div style={{ flex: "0.9", minWidth: "320px" }}>
                  <PressCounter />
                </div>
              </div>

              <TrollRiddles />
            </section>

            {/* 6. RULES SECTION */}
            <section className="border-t border-green-900/30 bg-green-900/5 pb-20">
              <div className="max-w-7xl mx-auto">
                <Rules />
              </div>
            </section>
          </>
        ) : (
          <div className="pt-10">
            {view === 'rules' && <Rules />}
            {view === 'help' && <Help />}
            {view === 'resources' && <Resources />}
            {view === 'logs' && <Logs />}
          </div>
        )}
      </main>

      <Footer setView={setView} />

      <div className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
    </div>
  );
}

export default App;