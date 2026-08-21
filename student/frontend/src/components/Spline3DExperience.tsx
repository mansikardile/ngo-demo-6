'use client';

import React, { useState } from 'react';
import { Sparkles, Box, Compass, Laptop, Cpu, Layers, Maximize2, RotateCcw } from 'lucide-react';

interface Spline3DExperienceProps {
  initialTab?: 'ai' | 'cloud' | 'laptop';
}

const SPLINE_SCENES = {
  ai: {
    title: 'AI Neural Matrix & Autonomous Nodes',
    tag: 'Deep Learning & ML Algorithms',
    desc: 'Interactive spatial simulation of distributed neural networks and tensor matrices trained in our fellowship AI labs.',
    // Spline interactive 3D particle/neural sphere
    url: 'https://my.spline.design/particlehovercopy-1d0fc878a87b322c3327f29a03977dc8/',
    accent: 'from-emerald-400 via-teal-300 to-[#ea580c]',
  },
  cloud: {
    title: 'Distributed Cloud Architecture & Web3',
    tag: 'High-Availability Cloud Systems',
    desc: 'Interactive 3D geometry visualizing multi-region Kubernetes clusters, microservices, and secure cryptographic layers.',
    // Spline interactive 3D geometric mesh
    url: 'https://my.spline.design/interactiveparticles-30bb4d1b8214300305f20108bebf5f19/',
    accent: 'from-sky-400 via-indigo-300 to-emerald-400',
  },
  laptop: {
    title: '100% Free Coding Workstation & Hardware',
    tag: 'Empowering Every Scholar with Tech',
    desc: 'Explore the high-performance engineering hardware granted to each Katalyst scholar for software development.',
    // Spline 3D computer/workstation setup
    url: 'https://my.spline.design/futuristiccomputer-980b3967d7301c23f2f01f37e4088009/',
    accent: 'from-[#ea580c] via-amber-300 to-rose-400',
  },
};

export default function Spline3DExperience({ initialTab = 'ai' }: Spline3DExperienceProps) {
  const [activeTab, setActiveTab] = useState<'ai' | 'cloud' | 'laptop'>(initialTab);
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0);

  const currentScene = SPLINE_SCENES[activeTab];

  const handleTabChange = (tab: 'ai' | 'cloud' | 'laptop') => {
    if (tab !== activeTab) {
      setIsLoading(true);
      setActiveTab(tab);
      setKey((prev) => prev + 1);
    }
  };

  const handleReload = () => {
    setIsLoading(true);
    setKey((prev) => prev + 1);
  };

  return (
    <section className="relative py-20 px-4 sm:px-8 bg-[#0a1510] text-white overflow-hidden rounded-[36px] my-14 max-w-7xl mx-auto shadow-2xl border border-emerald-900/40">
      {/* Ambient background radial glow effects */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-[#ea580c]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Context, Selector Tabs & Interaction Hints */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-700/60 text-emerald-300 text-xs font-bold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin duration-3000" />
            <span>Interactive 3D Spatial Sandbox • Spline WebGL</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.1]">
            Experience STEM <br />
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentScene.accent}`}>
              in Spatial 3D.
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {currentScene.desc}
          </p>

          {/* Interactive Feature Category Tabs */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <button
              onClick={() => handleTabChange('ai')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-emerald-900/50 border-emerald-500 text-white shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-400/40'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-5 h-5 text-emerald-400 mb-2" />
              <p className="text-xs font-bold leading-tight">AI & ML Nodes</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Neural Mesh</p>
            </button>

            <button
              onClick={() => handleTabChange('cloud')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                activeTab === 'cloud'
                  ? 'bg-emerald-900/50 border-emerald-500 text-white shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-400/40'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
            >
              <Layers className="w-5 h-5 text-teal-400 mb-2" />
              <p className="text-xs font-bold leading-tight">Cloud Infra</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Distributed</p>
            </button>

            <button
              onClick={() => handleTabChange('laptop')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                activeTab === 'laptop'
                  ? 'bg-emerald-900/50 border-emerald-500 text-white shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-400/40'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
            >
              <Laptop className="w-5 h-5 text-[#ea580c] mb-2" />
              <p className="text-xs font-bold leading-tight">Free Laptops</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Workstations</p>
            </button>
          </div>

          {/* User Interaction Guide */}
          <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
              <span>
                <strong>Click &amp; Drag</strong> to orbit • <strong>Hover</strong> for dynamic physics
              </span>
            </div>
            <button
              onClick={handleReload}
              title="Reset 3D Scene"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: 3D Spline Interactive Canvas */}
        <div className="lg:col-span-7 relative h-[420px] sm:h-[500px] w-full rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-[#07120c] to-emerald-950/30 border border-emerald-800/40 shadow-2xl group">
          {/* Shimmer Loading Skeleton */}
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#07120c]/90 backdrop-blur-md p-8 text-center animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 animate-spin">
                <Box className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-200">Loading Spline 3D Scene...</p>
              <p className="text-xs text-slate-400 mt-1">Initializing real-time WebGL canvas</p>
            </div>
          )}

          {/* Interactive Spline 3D WebGL Canvas */}
          <iframe
            key={key}
            src={currentScene.url}
            title={currentScene.title}
            onLoad={() => setIsLoading(false)}
            className="w-full h-full border-0 relative z-0"
            allow="autoplay; fullscreen"
          />

          {/* Floating HUD Badges */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-emerald-300 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Spline 3D • Real-time WebGL</span>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-slate-400">
              <Maximize2 className="w-3 h-3 text-emerald-400" />
              <span>Interactive 3D Viewport</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
