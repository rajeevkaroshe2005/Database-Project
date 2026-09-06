import React from 'react';
import {
  Bus,
  Train,
  Plane,
  Car,
  Film,
  Mic,
  Music,
  Drama,
  Trophy,
  Waves,
  Shield,
  Activity,
  Building,
  Utensils,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export default function CategoryCards({ onSelectCategory, activeCategory }) {
  const categories = [
    // Transport
    { id: 'flight', name: 'FLIGHT', group: 'Transport', icon: Plane, color: 'from-cyan-500 to-blue-600', count: '18 Routes' },
    { id: 'train', name: 'TRAIN', group: 'Transport', icon: Train, color: 'from-blue-600 to-indigo-600', count: 'Vande Bharat' },
    { id: 'bus', name: 'BUS', group: 'Transport', icon: Bus, color: 'from-indigo-600 to-purple-600', count: 'AC Sleeper' },
    { id: 'cab', name: 'CAB', group: 'Transport', icon: Car, color: 'from-purple-600 to-pink-600', count: 'Chauffeur' },

    // Entertainment
    { id: 'movie', name: 'MOVIE', group: 'Entertainment', icon: Film, color: 'from-rose-500 to-red-600', count: 'IMAX 4K' },
    { id: 'comedy', name: 'COMEDY', group: 'Entertainment', icon: Mic, color: 'from-amber-500 to-orange-600', count: 'Standup Live' },
    { id: 'concert', name: 'CONCERT', group: 'Entertainment', icon: Music, color: 'from-purple-500 to-indigo-600', count: 'Stadium Tour' },
    { id: 'theatre', name: 'THEATRE', group: 'Entertainment', icon: Drama, color: 'from-fuchsia-500 to-purple-600', count: 'Musical Plays' },

    // Sports
    { id: 'turf', name: 'TURF', group: 'Sports', icon: Trophy, color: 'from-emerald-500 to-teal-600', count: 'FIFA 7v7' },
    { id: 'pool', name: 'POOL', group: 'Sports', icon: Waves, color: 'from-teal-500 to-cyan-600', count: '50m Heated' },
    { id: 'ground', name: 'GROUND', group: 'Sports', icon: Shield, color: 'from-lime-500 to-emerald-600', count: 'Cricket Arena' },
    { id: 'court', name: 'COURT', group: 'Sports', icon: Activity, color: 'from-sky-500 to-blue-600', count: 'Badminton / Tennis' },

    // Hospitality & Experiences
    { id: 'hotel', name: 'HOTEL', group: 'Hospitality', icon: Building, color: 'from-amber-500 to-yellow-600', count: 'Private Villa' },
    { id: 'restaurant', name: 'RESTAURANT', group: 'Dining', icon: Utensils, color: 'from-orange-500 to-amber-600', count: 'Sky Lounge' },
    { id: 'themepark', name: 'THEME PARK', group: 'Experience', icon: Sparkles, color: 'from-violet-500 to-purple-600', count: 'Thrill Parks' },
  ];

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Unified Booking Directory
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Explore 15 Verticals. One System.
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md">
          Seamlessly book any seat, hourly sports slot, private villa, or rooftop dining table through a single unified engine.
        </p>
      </div>

      {/* Grid with 3D Hover Tilt effect */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group relative p-4 rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 ${
                isSelected
                  ? 'bg-space-850 border-2 border-cyan-400 shadow-glow-cyan'
                  : 'glass-panel hover:border-cyan-500/40 hover:shadow-glow-cyan'
              }`}
            >
              {/* Glow Accent Top Right */}
              <div className="absolute top-3 right-3 text-slate-500 group-hover:text-cyan-400 transition-colors">
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>

              {/* Icon Container with glowing gradient background */}
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${cat.color} p-0.5 shadow-md group-hover:scale-110 transition-transform mb-3`}>
                <div className="w-full h-full bg-space-950/80 rounded-[10px] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Category Info */}
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                {cat.group}
              </div>
              <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mt-0.5">
                {cat.name}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {cat.count}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
