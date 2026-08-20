'use client';

import React from 'react';
import { Award, Laptop, Sparkles } from 'lucide-react';

export default function IndiaMapHeroVisual() {
  return (
    <div className="relative w-full max-w-[540px] mx-auto flex items-center justify-center select-none py-6">
      {/* Ambient background decorative dots / confetti */}
      <div className="absolute top-2 left-8 w-3.5 h-3.5 rounded-full bg-[#ea580c] shadow-lg animate-bounce duration-1000" />
      <div className="absolute top-1/4 -left-3 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md" />
      <div className="absolute bottom-20 left-6 w-3.5 h-3.5 rounded-full bg-sky-500 shadow-md animate-pulse" />
      <div className="absolute top-10 right-2 w-3 h-3 rounded-full bg-rose-500 shadow-md animate-bounce" />
      <div className="absolute bottom-32 -right-4 w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-md" />
      <div className="absolute top-1/2 -right-3 w-4 h-4 rounded-full bg-amber-400 shadow-md" />
      <div className="absolute bottom-4 right-16 w-3 h-3 rounded-full bg-emerald-400 shadow-md animate-pulse" />

      {/* Subtle Glow Behind India Map */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/30 via-emerald-200/20 to-indigo-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Main Container with Exact Masked India Map Silhouette */}
      <div className="relative w-full aspect-[1/1] max-w-[500px] flex items-center justify-center filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)] group">
        {/* Masked Photo of Indian Female Engineering Scholars */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            maskImage: 'url(/images/india_map_exact.png)',
            WebkitMaskImage: 'url(/images/india_map_exact.png)',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
          }}
        >
          <img
            src="/images/indian_scholars_hero.jpg"
            alt="Young Indian Women Engineering Scholars"
            className="w-full h-full object-cover scale-110 group-hover:scale-115 transition-transform duration-700"
          />
          {/* Subtle Warm Overlay for Depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 pointer-events-none" />
        </div>

        {/* Crisp Exact Map Outline Overlay */}
        <img
          src="/images/india_map_exact.png"
          alt="India Map Contour"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-85 filter contrast-125"
        />
      </div>

      {/* Floating Badge 1: 100% Free Laptops */}
      <div className="absolute top-6 -left-2 sm:-left-6 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-2xl max-w-[200px] animate-float z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
            <Laptop className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-900 leading-tight">100% Free Laptops</p>
            <p className="text-[9px] text-slate-500 font-medium">Brand-new coding devices</p>
          </div>
        </div>
      </div>

      {/* Floating Badge 2: 4,500+ STEM Scholars */}
      <div className="absolute bottom-8 -right-2 sm:-right-4 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-2xl max-w-[210px] animate-float-delayed z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#ea580c] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
            <Award className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-900 leading-tight">4,500+ STEM Scholars</p>
            <p className="text-[9px] text-slate-500 font-medium">Pan-India Fellowship reach</p>
          </div>
        </div>
      </div>
    </div>
  );
}
