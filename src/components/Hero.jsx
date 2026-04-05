import React from 'react';
import Countdown from './Countdown';
import LetterGlitch from '../animations/LetterGlitch';

const Hero = () => {
  return (
    <section className="relative h-[80vh] w-full flex flex-col items-center justify-center px-10">
      <div className="absolute inset-0 z-0 opacity-40">
        <LetterGlitch glitchSpeed={50} centerVignette={true} smooth={true} />
      </div>
      <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-7xl">
        <div className="flex flex-col justify-center">
          <p className="text-sm tracking-widest mb-2 font-bold">// BROADCAST TERMINATED - DAY 001</p>
          <h1 className="text-8xl font-black leading-none mb-4  text-white">THE LAST <br /> BROADCAST</h1>
          <h2 className="text-xl font-bold bg-green-500 text-black px-2 py-1 w-fit mb-6 ">A BUILD-TO-SURVIVE CHALLENGE</h2>
          <p className="max-w-md  text-sm opacity-70 border-l-2 border-red-600 pl-4">All transmissions have gone dark. The system is failing. Find the fragments buried in layers you haven't touched yet.</p>
        </div>
        <div className="border border-green-900/50 p-6 bg-black/60 backdrop-blur-md">
          <div className="flex justify-between text-[10px] mb-4 border-b border-green-900 pb-2">
            <span>// SYSTEM COLLAPSE</span>
            <span className="text-red-500 font-bold animate-pulse">STATUS: CRITICAL</span>
          </div>
          <Countdown />
          <div className="mt-8 space-y-2 text-[10px]">
            <div className="flex justify-between italic"><span>SIGNAL:</span><span className="text-red-600">DEAD</span></div>
            <div className="flex justify-between"><span>FREQ:</span><span>501.5 MHz</span></div>
            <div className="flex justify-between"><span>LAYER:</span><span>01 / ??</span></div>
            <div className="w-full bg-green-900/20 h-1 mt-4"><div className="bg-green-500 h-full w-1/3 animate-pulse"></div></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;