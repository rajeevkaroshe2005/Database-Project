import React, { useState } from 'react';
import {
  Play,
  Pause,
  Gauge,
  Camera,
  Compass,
  MapPin,
  ArrowRight,
  Sparkles,
  Building2,
  Film,
  Trophy,
  UtensilsCrossed,
  PlaneTakeoff,
  RotateCcw
} from 'lucide-react';
import CityTour3DScene from './CityTour3DScene';

export default function HeroBusTour({ onSelectService, services = [] }) {
  const [isDriving, setIsDriving] = useState(true);
  const [speedLevel, setSpeedLevel] = useState('express'); // 'cruise' | 'express' | 'turbo'
  const [cameraMode, setCameraMode] = useState('chase'); // 'chase' | 'orbit' | 'hood'
  const [currentLandmark, setCurrentLandmark] = useState({
    id: 'hotel',
    title: 'The Azure Bay Cliffside Pool Villa',
    category: 'HOTEL',
    city: 'Goa',
    price: '₹14,000/night'
  });

  const speedMultiplier = speedLevel === 'cruise' ? 0.75 : speedLevel === 'express' ? 1.35 : 2.2;
  const speedKmh = speedLevel === 'cruise' ? 45 : speedLevel === 'express' ? 80 : 120;

  const matchedDbService = services.find(s => {
    if (!currentLandmark) return false;
    return s.title?.toLowerCase().includes(currentLandmark.title?.toLowerCase().split(' ')[0]) ||
           s.parent_type === currentLandmark.category;
  }) || services[0];

  const getLandmarkIcon = (cat) => {
    switch (cat) {
      case 'HOTEL': return <Building2 className="w-4 h-4 text-gold" />;
      case 'ENTERTAINMENT': return <Film className="w-4 h-4 text-terracotta" />;
      case 'SPORTS': return <Trophy className="w-4 h-4 text-emerald-400" />;
      case 'RESTAURANT': return <UtensilsCrossed className="w-4 h-4 text-[#171513]" />;
      case 'TRANSPORT': return <PlaneTakeoff className="w-4 h-4 text-gold" />;
      default: return <Compass className="w-4 h-4 text-gold" />;
    }
  };

  return (
    <div className="relative w-full h-[480px] sm:h-[520px] lg:h-[580px] rounded-3xl overflow-hidden glass-panel border border-[#D4C8B8] shadow-2xl bg-gradient-to-b from-[#FAF8F3] via-[#F3EFE6] to-[#EAE4D8] border border-sand-300 shadow-luxury select-none">
      {/* Top HUD Controls Overlay */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between gap-2 pointer-events-auto">
        {/* Live Status Badge */}
        <div className="bg-white/90 px-3.5 py-1.5 rounded-full border border-sand-300 text-xs font-mono text-charcoal flex items-center gap-2 shadow-sm backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-terracotta animate-pulse" />
          <span className="font-bold text-xs uppercase tracking-wider text-gold">
            BookSphere Express 3D
          </span>
          <span className="text-[#171513]/50 hidden sm:inline">•</span>
          <span className="text-[#171513] font-bold text-xs hidden sm:inline">{speedKmh} km/h</span>
        </div>

        {/* Quick Controls: Speed, Camera & Play/Pause */}
        <div className="flex items-center gap-1.5 bg-white/90 p-1 rounded-2xl border border-sand-300 shadow-sm backdrop-blur-md">
          {/* Speed Preset Button */}
          <button
            onClick={() => {
              if (speedLevel === 'cruise') setSpeedLevel('express');
              else if (speedLevel === 'express') setSpeedLevel('turbo');
              else setSpeedLevel('cruise');
            }}
            className="px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold bg-sand-100 text-charcoal border border-sand-300 hover:border-terracotta transition-all flex items-center gap-1"
            title="Toggle Highway Speed"
          >
            <Gauge className="w-3 h-3 text-gold" />
            <span>{speedKmh} km/h</span>
          </button>

          {/* Camera Switcher */}
          <button
            onClick={() => setCameraMode(cameraMode === 'chase' ? 'orbit' : 'chase')}
            className={"px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all flex items-center gap-1 " +
              (cameraMode === 'orbit'
                ? "bg-gold/20 text-gold border-gold/40 shadow-warm"
                : "bg-sand-100 text-charcoal border border-sand-300 hover:text-espresso")}
            title="Toggle between Chase Camera and Free 3D Orbit"
          >
            <Camera className="w-3 h-3 text-gold" />
            <span className="hidden sm:inline">{cameraMode === 'orbit' ? 'Free Orbit' : 'Follow Bus'}</span>
          </button>

          {/* Play/Pause */}
          <button
            onClick={() => setIsDriving(!isDriving)}
            className={"p-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all " +
              (isDriving
                ? "bg-forest/40 text-emerald-300 border-forest/50"
                : "bg-terracotta/20 text-terracotta border-terracotta/40")}
            title={isDriving ? "Pause Cruise" : "Resume Cruise"}
          >
            {isDriving ? <Pause className="w-3.5 h-3.5 fill-emerald-300" /> : <Play className="w-3.5 h-3.5 fill-terracotta" />}
          </button>
        </div>
      </div>

      {/* The 3D Bus & Highway Scene */}
      <div className="w-full h-full">
        <CityTour3DScene
          speed={speedMultiplier}
          isDriving={isDriving}
          cameraMode={cameraMode}
          onLandmarkChange={setCurrentLandmark}
        />
      </div>

      {/* Bottom Milestone Card: Shows landmark the bus is passing right now */}
      {currentLandmark && (
        <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto sm:max-w-md z-20 bg-white/95 p-4 rounded-2xl border border-sand-300 shadow-luxury backdrop-blur-md animate-in fade-in space-y-2.5 pointer-events-auto">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sand-100 text-terracotta border border-sand-300">
                {getLandmarkIcon(currentLandmark.category)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-terracotta font-bold block leading-none">
                    Now Passing:
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-sand-100 text-charcoal text-[9px] font-mono font-bold border border-sand-300">
                    {currentLandmark.category}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-espresso mt-0.5 truncate max-w-[220px]">
                  {currentLandmark.title}
                </h4>
              </div>
            </div>

            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-forest/30 text-emerald-300 border border-forest/40 font-bold whitespace-nowrap">
              {currentLandmark.price}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-sand-200 text-xs">
            <span className="text-charcoal/70 flex items-center gap-1.5 font-mono text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-gold" />
              {currentLandmark.city} • Verified Available
            </span>

            <button
              onClick={() => {
                if (onSelectService && matchedDbService) {
                  onSelectService(matchedDbService);
                } else {
                  const el = document.getElementById('catalog-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-terracotta flex items-center gap-1.5"
            >
              <span>Book Venue</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Subtle Bottom Right Hint */}
      <div className="absolute bottom-2.5 right-3 text-[10px] text-slate-400 font-mono hidden md:flex items-center gap-1.5 pointer-events-none bg-white/80 px-2 py-1 rounded-lg border border-sand-300 text-charcoal/60">
        <span>Click & drag to rotate 3D world</span>
        <span>•</span>
        <span>Scroll to zoom</span>
      </div>
    </div>
  );
}
