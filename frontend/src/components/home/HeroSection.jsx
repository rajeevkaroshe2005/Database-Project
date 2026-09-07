import React from 'react';
import { Compass, Sparkles, ArrowDown, ShieldCheck } from 'lucide-react';
import HeroBusTour from '../3d/HeroBusTour';
import FloatingSearchBar from './FloatingSearchBar';
import ParticleField from '../3d/ParticleField';

export default function HeroSection({ onSelectService, onSearchSubmit, onExploreCatalog, services = [] }) {
  return (
    <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-white">
      {/* Ambient 3D Particle Field */}
      <ParticleField />

      {/* Subtle Warm Amber Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-amber-100/60 via-orange-50/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Editorial Headline & Value Propositions */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
            {/* Super Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F3] border border-[#DDD3C4] text-xs font-bold text-[#B86B4B] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span>The Premier Unified Reservation System</span>
            </div>

            {/* Editorial Heading: 100% Solid Visible Colors - Never Transparent! */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#171513] leading-[1.12] font-serif">
              BOOK YOUR NEXT{' '}
              <span className="block font-serif italic text-[#B86B4B] mt-1">
                EXPERIENCE
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#38342F] max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans font-normal">
              Travel. Watch. Play. Stay. Everything you love, in one unified place. Connect to 20+ verticals with live seat locks and instant verification.
            </p>

            {/* Quick Feature Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-semibold text-[#38342F]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C9A96E] ring-2 ring-[#C9A96E]/30" />
                <span>Real-Time Seat Locks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#243B35] ring-2 ring-[#243B35]/30" />
                <span>Zero Double Booking</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B86B4B] ring-2 ring-[#B86B4B]/30" />
                <span>Instant Dynamic QR</span>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <button
                onClick={onExploreCatalog}
                className="btn-primary w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-bold text-white shadow-terracotta flex items-center justify-center gap-2"
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
