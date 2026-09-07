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
    // Transport (Forest Green theme)
    { id: 'flight', name: 'FLIGHT', group: 'Transport', icon: Plane, color: 'bg-forest/15 text-forest border border-forest/30', count: '18 Routes' },
    { id: 'train', name: 'TRAIN', group: 'Transport', icon: Train, color: 'bg-forest/15 text-forest border border-forest/30', count: 'Vande Bharat' },
    { id: 'bus', name: 'BUS', group: 'Transport', icon: Bus, color: 'bg-forest/15 text-forest border border-forest/30', count: 'AC Sleeper' },
    { id: 'cab', name: 'CAB', group: 'Transport', icon: Car, color: 'bg-forest/15 text-forest border border-forest/30', count: 'Chauffeur' },

    // Entertainment (Terracotta theme)
    { id: 'movie', name: 'MOVIE', group: 'Entertainment', icon: Film, color: 'bg-terracotta/15 text-terracotta border border-terracotta/30', count: 'IMAX 4K' },
    { id: 'comedy', name: 'COMEDY', group: 'Entertainment', icon: Mic, color: 'bg-terracotta/15 text-terracotta border border-terracotta/30', count: 'Standup Live' },
    { id: 'concert', name: 'CONCERT', group: 'Entertainment', icon: Music, color: 'bg-terracotta/15 text-terracotta border border-terracotta/30', count: 'Stadium Tour' },
    { id: 'theatre', name: 'THEATRE', group: 'Entertainment', icon: Drama, color: 'bg-terracotta/15 text-terracotta border border-terracotta/30', count: 'Musical Plays' },

    // Sports (Forest Green theme)
    { id: 'turf', name: 'TURF', group: 'Sports', icon: Trophy, color: 'bg-forest/15 text-forest border border-forest/30', count: 'FIFA 7v7' },
    { id: 'pool', name: 'POOL', group: 'Sports', icon: Waves, color: 'bg-forest/15 text-forest border border-forest/30', count: '50m Heated' },
    { id: 'ground', name: 'GROUND', group: 'Sports', icon: Shield, color: 'bg-forest/15 text-forest border border-forest/30', count: 'Cricket Arena' },
    { id: 'court', name: 'COURT', group: 'Sports', icon: Activity, color: 'bg-forest/15 text-forest border border-forest/30', count: 'Badminton / Tennis' },

    // Hospitality & Dining (Muted Gold theme)
    { id: 'hotel', name: 'HOTEL', group: 'Hospitality', icon: Building, color: 'bg-gold-500/20 text-gold-700 border border-gold-500/40', count: 'Private Villa' },
    { id: 'restaurant', name: 'RESTAURANT', group: 'Dining', icon: Utensils, color: 'bg-gold-500/20 text-gold-700 border border-gold-500/40', count: 'Sky Lounge' },
    { id: 'themepark', name: 'THEME PARK', group: 'Experience', icon: Sparkles, color: 'bg-terracotta/15 text-terracotta border border-terracotta/30', count: 'Thrill Parks' },
  ];

  return (
    <section className="py-16 bg-ivory text-espresso border-y border-sand-300/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-terracotta">
              Unified Booking Directory
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-espresso mt-1 font-serif">
              Explore 15 Verticals. One System.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-charcoal/70 max-w-md font-sans">
            Seamlessly book any seat, hourly sports slot, private villa, or rooftop dining table through a single unified engine.
          </p>
        </div>

        {/* Grid of Editorial Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group relative p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                  isSelected
                    ? 'bg-warmwhite border-2 border-terracotta shadow-terracotta'
                    : 'bg-warmwhite border border-sand-300/80 shadow-sm hover:shadow-warm hover:border-sand-400'
                }`}
              >
                {/* Arrow Top Right */}
                <div className="absolute top-3.5 right-3.5 text-sand-400 group-hover:text-terracotta transition-colors">
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>

                {/* Icon Container with refined tone */}
                <div className={`w-11 h-11 rounded-xl p-2 flex items-center justify-center mb-3 transition-transform group-hover:scale-105 ${cat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Category Info */}
                <div className="text-[10px] text-sand-500 uppercase tracking-wider font-bold">
                  {cat.group}
                </div>
                <div className="text-sm font-bold text-espresso group-hover:text-terracotta transition-colors mt-0.5 font-serif">
                  {cat.name}
                </div>
                <div className="text-[11px] text-charcoal/60 mt-1 font-sans">
                  {cat.count}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
