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
      case 'HOTEL': return <Building2 className="w-4 h-4 text-cyan-400" />;
      case 'ENTERTAINMENT': return <Film className="w-4 h-4 text-purple-400" />;
      case 'SPORTS': return <Trophy className="w-4 h-4 text-emerald-400" />;
      case 'RESTAURANT': return <UtensilsCrossed className="w-4 h-4 text-amber-400" />;
      case 'TRANSPORT': return <PlaneTakeoff className="w-4 h-4 text-blue-400" />;
      default: return <Compass className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="relative w-full h-[460px] sm:h-[500px] lg:h-[540px] rounded-3xl overflow-hidden glass-panel border border-cyan-500/30 shadow-2xl bg-gradient-to-b from-space-950 via-space-900 to-space-950 select-none">
      {/* Top HUD Controls Overlay */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between gap-2 pointer-events-auto">
        {/* Live Status Badge */}
        <div className="glass-panel px-3 py-1.5 rounded-full border border-cyan-500/40 text-xs font-mono text-white flex items-center gap-2 shadow-glow-cyan backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-bold text-[11px] uppercase tracking-wider text-cyan-300">
            BookSphere Express 3D
          </span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-300 text-[10px] hidden sm:inline">{speedKmh} km/h</span>
        </div>

        {/* Quick Controls: Camera & Play/Pause */}
        <div className="flex items-center gap-1.5 glass-panel p-1 rounded-2xl border border-white/10 backdrop-blur-md">
          <button
            onClick={() => setIsDriving(!isDriving)}
            className={"p-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all " +
              (isDriving
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-amber-500/20 text-amber-300 border-amber-500/40")}
            title={isDriving ? "Pause Cruise" : "Resume Cruise"}
          >
            {isDriving ? <Pause className="w-3.5 h-3.5 fill-emerald-300" /> : <Play className="w-3.5 h-3.5 fill-amber-300" />}
          </button>

          <button
            onClick={() => setCameraMode(cameraMode === 'chase' ? 'orbit' : 'chase')}
            className={"px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all flex items-center gap-1 " +
              (cameraMode === 'orbit'
                ? "bg-purple-600/40 text-purple-200 border-purple-400 shadow-glow-purple"
                : "bg-white/5 text-slate-300 border-white/10 hover:text-white")}
            title="Toggle between Chase Camera and Free 3D Orbit"
          >
            <Camera className="w-3 h-3 text-cyan-300" />
            <span className="hidden sm:inline">{cameraMode === 'orbit' ? 'Free Orbit' : 'Follow Bus'}</span>
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
        <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto sm:max-w-sm z-20 glass-panel p-3.5 rounded-2xl border border-cyan-500/30 bg-space-950/85 backdrop-blur-md shadow-glow-cyan animate-in fade-in space-y-2 pointer-events-auto">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white/10 border border-white/10">
                {getLandmarkIcon(currentLandmark.category)}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block leading-none">
                  Now Passing:
                </span>
                <h4 className="text-xs font-bold text-white mt-0.5 truncate max-w-[200px]">
                  {currentLandmark.title}
                </h4>
              </div>
            </div>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold whitespace-nowrap">
              {currentLandmark.price}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[11px]">
            <span className="text-slate-400 flex items-center gap-1 font-mono">
              <MapPin className="w-3 h-3 text-cyan-400" />
              {currentLandmark.city} • {currentLandmark.category}
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
              className="glow-button px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shadow-glow-cyan flex items-center gap-1"
            >
              <span>Book Venue</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      )}

      {/* Subtle Bottom Right Hint */}
      <div className="absolute bottom-2.5 right-3 text-[10px] text-slate-500 font-mono hidden md:flex items-center gap-1.5 pointer-events-none">
        <span>Drag to rotate</span>
        <span>•</span>
        <span>Scroll to zoom</span>
      </div>
    </div>
  );
}
