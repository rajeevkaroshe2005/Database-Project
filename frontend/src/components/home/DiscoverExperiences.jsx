import React, { useRef } from 'react';
import { Star, MapPin, ChevronLeft, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export default function DiscoverExperiences({ services = [], onBookNow }) {
  const scrollRef = useRef(null);
  const { formatPrice } = useCurrency();

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Collections
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Discover Something New
          </h2>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-xl glass-panel text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-xl glass-panel text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-6 pt-1 scrollbar-none snap-x snap-mandatory"
      >
        {services.map((s) => (
          <div
            key={s.id}
            className="min-w-[290px] sm:min-w-[340px] max-w-[340px] snap-start glass-panel rounded-2xl overflow-hidden border border-white/10 group hover:border-cyan-500/40 hover:shadow-glow-cyan transition-all duration-300 flex flex-col justify-between"
          >
            {/* Image Container */}
            <div className="relative h-48 w-full overflow-hidden bg-space-900">
              <img
                src={s.cover_image}
                alt={s.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-transparent to-transparent opacity-90" />

              {/* Category Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-space-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                {s.parent_type}
              </div>

              {/* Status Badge */}
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Available
              </div>

              {/* Location Pin */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs text-slate-300 font-medium">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{s.city}</span>
              </div>
            </div>

            {/* Details */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1 text-amber-400 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{s.rating}</span>
                  <span className="text-slate-500 font-normal">({s.review_count} reviews)</span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {s.tagline || s.description}
                </p>
              </div>

              {/* Price & Action */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Starting from</div>
                  <div className="text-base font-extrabold text-white">
                    {formatPrice(s.base_price)}
                    <span className="text-[11px] font-normal text-slate-400 ml-1">/{s.price_unit.replace('per ', '')}</span>
                  </div>
                </div>

                <button
                  onClick={() => onBookNow(s)}
                  className="glow-button px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-glow-cyan"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
