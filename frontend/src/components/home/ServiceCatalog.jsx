import React, { useState } from 'react';
import { Star, MapPin, Search, Filter, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export default function ServiceCatalog({
  services = [],
  activeCategory,
  onSelectCategory,
  onBookNow
}) {
  const { formatPrice } = useCurrency();
  const [selectedCity, setSelectedCity] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');

  const cities = ['All', 'Mumbai', 'Pune', 'Bengaluru', 'Delhi NCR', 'Goa', 'Hyderabad'];

  let filtered = [...services];

  if (activeCategory && activeCategory !== 'all') {
    filtered = filtered.filter(
      s => s.category_slug === activeCategory || s.parent_type.toLowerCase() === activeCategory.toLowerCase()
    );
  }

  if (selectedCity !== 'All') {
    filtered = filtered.filter(s => s.city.toLowerCase() === selectedCity.toLowerCase());
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      s => s.title.toLowerCase().includes(q) || s.tagline.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)
    );
  }

  if (sortBy === 'price_asc') {
    filtered.sort((a, b) => a.base_price - b.base_price);
  } else if (sortBy === 'price_desc') {
    filtered.sort((a, b) => b.base_price - a.base_price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return (
    <section id="catalog-section" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Real-Time MySQL Catalog
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Available Venues & Travel Routes
          </h2>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* City Selector */}
          <div className="flex items-center glass-panel px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs"
            >
              {cities.map(c => (
                <option key={c} value={c} className="bg-space-900 text-white">{c}</option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center glass-panel px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <Filter className="w-3.5 h-3.5 text-purple-400 mr-1.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs"
            >
              <option value="featured" className="bg-space-900 text-white">Recommended</option>
              <option value="price_asc" className="bg-space-900 text-white">Price: Low to High</option>
              <option value="price_desc" className="bg-space-900 text-white">Price: High to Low</option>
              <option value="rating" className="bg-space-900 text-white">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl border border-white/10 p-8 max-w-md mx-auto">
          <p className="text-sm font-semibold text-white">No experiences match your filters.</p>
          <button
            onClick={() => {
              setSelectedCity('All');
              onSelectCategory('all');
            }}
            className="mt-3 text-xs text-cyan-400 hover:underline"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="glass-panel rounded-2xl overflow-hidden border border-white/10 group hover:border-cyan-500/40 hover:shadow-glow-cyan transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Cover Image */}
                <div className="relative h-48 w-full overflow-hidden bg-space-900">
                  <img
                    src={s.cover_image}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-transparent to-transparent opacity-85" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-space-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                    {s.parent_type}
                  </div>

                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Available
                  </div>

                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs text-slate-300 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{s.city}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{s.rating}</span>
                    <span className="text-slate-500 font-normal">({s.review_count} reviews)</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {s.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {s.tagline || s.description}
                  </p>

                  {/* Amenities Tags */}
                  {s.amenities && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {s.amenities.slice(0, 3).map((a, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md text-[10px] bg-white/5 text-slate-300 border border-white/5">
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Price & Booking Button */}
              <div className="p-4 pt-0 mt-2">
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Starting from</div>
                    <div className="text-base font-extrabold text-white">
                      {formatPrice(s.base_price)}
                      <span className="text-[11px] font-normal text-slate-400 ml-1">/{s.price_unit.replace('per ', '')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onBookNow(s)}
                    className="glow-button px-4 py-2 rounded-xl text-xs font-bold text-white shadow-glow-cyan"
                  >
                    Reserve Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
