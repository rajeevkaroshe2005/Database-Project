import React from 'react';
import { Compass, Sparkles, ArrowDown, ShieldCheck } from 'lucide-react';
import HeroBusTour from '../3d/HeroBusTour';
import FloatingSearchBar from './FloatingSearchBar';
import ParticleField from '../3d/ParticleField';

export default function HeroSection({ onSelectService, onSearchSubmit, onExploreCatalog, services = [] }) {
  return (
    <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Ambient 3D Particle Field */}
      <ParticleField />

      {/* Radial Gradient Accent Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-cyan-500/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Editorial Headline & Value Propositions */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
            {/* Super Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-semibold text-cyan-300 shadow-glow-cyan">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>The Premier Unified Reservation System</span>
            </div>

            {/* Editorial Heading */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.08] font-display">
              BOOK YOUR NEXT{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400">
                EXPERIENCE
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Travel. Watch. Play. Stay. Everything you love, in one unified place. Connect to 20+ verticals with live seat locks and instant verification.
            </p>

            {/* Quick Feature Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Real-Time Seat Locks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Zero Double Booking</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Instant Dynamic QR</span>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <button
                onClick={onExploreCatalog}
                className="glow-button w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-white shadow-glow-cyan flex items-center justify-center gap-2"
              >
                <span>Browse 15 Categories</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </button>
            </div>
          </div>

          {/* Right Column: High-Quality Interactive 3D Bus Tour Scene */}
          <div className="lg:col-span-6 relative">
            <HeroBusTour onSelectService={onSelectService} services={services} />
          </div>
        </div>

        {/* Floating Multi-Category Search System */}
        <div className="mt-10 lg:mt-12 relative z-20">
          <FloatingSearchBar onSearchSubmit={onSearchSubmit} />
        </div>
      </div>
    </div>
  );
}
