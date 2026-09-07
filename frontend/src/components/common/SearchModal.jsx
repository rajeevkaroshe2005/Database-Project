import React, { useState } from 'react';
import { Search, X, MapPin, ArrowRight } from 'lucide-react';

export default function SearchModal({ services = [], onClose, onSelectService }) {
  const [query, setQuery] = useState('');

  const matches = query.trim()
    ? services.filter(
        s =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.city.toLowerCase().includes(query.toLowerCase()) ||
          s.parent_type.toLowerCase().includes(query.toLowerCase()) ||
          s.tagline.toLowerCase().includes(query.toLowerCase())
      )
    : services.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-space-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl glass-panel rounded-3xl border border-white/15 shadow-2xl p-4 sm:p-6 space-y-4">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <Search className="w-5 h-5 text-gold-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search flights, movies, turfs, villas, dining..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
          />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">
            {query.trim() ? `Search Results (${matches.length})` : 'Popular Destinations'}
          </div>

          {matches.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No experiences found matching "{query}"
            </div>
          ) : (
            matches.map((s) => (
              <div
                key={s.id}
                onClick={() => {
                  onSelectService(s);
                  onClose();
                }}
                className="p-3 rounded-xl border border-white/5 hover:border-gold-500/40 hover:bg-white/5 cursor-pointer transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <img src={s.cover_image} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-gold-300 transition-colors">
                      {s.title}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="text-gold-400 font-semibold">{s.parent_type}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {s.city}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-xs">
                    <div className="font-extrabold text-white">₹{s.base_price.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-slate-500">{s.price_unit}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
