import React from 'react';
import { Armchair, Check, ShieldAlert } from 'lucide-react';

export default function SeatSelector({
  serviceType,
  categorySlug,
  inventory = {},
  selectedSeats = [],
  onToggleSeat
}) {
  const seats = inventory.seats || [];
  const berths = inventory.berths || [];

  // 1. MOVIE / CINEMA THEATER LAYOUT
  if (inventory.type === 'SEAT_GRID') {
    const rows = ['A', 'B', 'C', 'D'];

    return (
      <div className="w-full flex flex-col items-center">
        {/* Curved Screen / Live Stage Banner */}
        <div className="w-full max-w-lg mb-6 flex flex-col items-center">
          <div className="w-full h-2 rounded-t-full bg-gradient-to-r from-transparent via-gold-400 to-transparent shadow-warm" />
          <div className="text-[10px] uppercase tracking-widest text-slate-400 mt-1 font-semibold">
            {categorySlug === 'movie'
              ? 'All Eyes Here • Curved IMAX Laser Screen'
              : 'Live Stage • Center Spotlight & Acoustic Zone'}
          </div>
        </div>

        {/* Seat Grid Rows */}
        <div className="space-y-3 w-full max-w-md">
          {rows.map((row) => {
            const rowSeats = seats.filter((s) => s.row === row);
            const rowClass = rowSeats[0]?.seatClass || 'GOLD';
            const price = rowSeats[0]?.price || 480;

            return (
              <div key={row} className="flex items-center gap-2">
                <span className="w-4 text-xs font-bold text-slate-400 text-center">{row}</span>
                <div className="grid grid-cols-8 gap-2 flex-1 justify-items-center">
                  {rowSeats.map((seat) => {
                    const isSelected = selectedSeats.includes(seat.id);
                    const isBooked = seat.status === 'booked';
                    const isHeld = seat.status === 'held';

                    let seatStyle = 'bg-charcoal border-sand-500/30 text-sand-200 hover:border-gold-400 hover:text-warmwhite';
                    if (isBooked) {
                      seatStyle = 'bg-surface border-sand-500/20 text-sand-500/40 cursor-not-allowed';
                    } else if (isHeld) {
                      seatStyle = 'bg-gold-500/20 border-gold-500/50 text-gold-300 cursor-not-allowed animate-pulse';
                    } else if (isSelected) {
                      seatStyle = 'bg-terracotta border-terracotta text-white font-bold shadow-terracotta scale-105';
                    }

                    return (
                      <button
                        key={seat.id}
                        disabled={isBooked || isHeld}
                        onClick={() => onToggleSeat(seat.id)}
                        className={`w-8 h-8 rounded-lg text-[11px] font-semibold flex items-center justify-center border transition-all duration-200 relative ${seatStyle}`}
                        title={`${seat.id} (${seatClass}) — ₹${price}`}
                      >
                        {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : seat.number}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs mt-6 pt-4 border-t border-white/10 text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-space-900 border border-slate-700" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-cyan-500 border border-cyan-300" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-950/40 border border-amber-500/50" />
            <span>Held (5 min)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-red-950/40 border border-red-900/60" />
            <span>Booked</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. FLIGHT CABIN LAYOUT
  if (inventory.type === 'FLIGHT_CABIN') {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
          Aircraft Seating Map (Boeing 787)
        </div>

        {/* Business Class Section */}
        <div className="glass-panel p-3 rounded-xl border border-gold-500/30 mb-4">
          <div className="text-[10px] uppercase font-bold text-gold-400 mb-2 flex items-center justify-between">
            <span>Executive Business Class</span>
            <span>2x2 Layout</span>
          </div>
          <div className="grid grid-cols-6 gap-2 justify-items-center">
            {seats.filter(s => s.seatClass === 'BUSINESS').map((s) => {
              const isSelected = selectedSeats.includes(s.id);
              const isBooked = s.status === 'booked';
              return (
                <button
                  key={s.id}
                  disabled={isBooked}
                  onClick={() => onToggleSeat(s.id)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold border transition-all ${
                    isBooked
                      ? 'bg-red-950/40 border-red-900 text-red-700 cursor-not-allowed'
                      : isSelected
                      ? 'bg-terracotta border-terracotta text-white shadow-terracotta'
                      : 'bg-charcoal border-sand-500/30 text-slate-300 hover:border-cyan-400'
                  }`}
                >
                  {s.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Economy Class Section */}
        <div className="glass-panel p-3 rounded-xl border border-white/10">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center justify-between">
            <span>Main Cabin Economy</span>
            <span>3x3 Layout</span>
          </div>
          <div className="grid grid-cols-6 gap-2 justify-items-center">
            {seats.filter(s => s.seatClass === 'ECONOMY').map((s) => {
              const isSelected = selectedSeats.includes(s.id);
              const isBooked = s.status === 'booked';
              return (
                <button
                  key={s.id}
                  disabled={isBooked}
                  onClick={() => onToggleSeat(s.id)}
                  className={`w-9 h-9 rounded-lg text-xs font-medium border transition-all ${
                    isBooked
                      ? 'bg-red-950/40 border-red-900 text-red-700 cursor-not-allowed'
                      : isSelected
                      ? 'bg-terracotta border-terracotta text-white font-bold shadow-terracotta'
                      : 'bg-charcoal border-sand-500/30 text-slate-300 hover:border-cyan-400'
                  }`}
                >
                  {s.id}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 3. BUS SLEEPER BERTHS
  if (inventory.type === 'BUS_BERTHS') {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-panel p-3 rounded-xl border border-white/10">
            <div className="text-xs font-bold text-slate-300 mb-2">Lower Deck Berths</div>
            <div className="grid grid-cols-2 gap-2">
              {berths.filter(b => b.id.startsWith('L')).map((b) => {
                const isSelected = selectedSeats.includes(b.id);
                const isBooked = b.status === 'booked';
                return (
                  <button
                    key={b.id}
                    disabled={isBooked}
                    onClick={() => onToggleSeat(b.id)}
                    className={`h-12 rounded-lg text-xs font-semibold border flex items-center justify-center transition-all ${
                      isBooked
                        ? 'bg-red-950/40 border-red-900 text-red-700 cursor-not-allowed'
                        : isSelected
                        ? 'bg-terracotta border-terracotta text-white font-bold shadow-terracotta'
                        : 'bg-charcoal border-sand-500/30 text-slate-300 hover:border-cyan-400'
                    }`}
                  >
                    {b.id} ({b.tier.split(' ')[0]})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass-panel p-3 rounded-xl border border-white/10">
            <div className="text-xs font-bold text-slate-300 mb-2">Upper Deck Berths</div>
            <div className="grid grid-cols-2 gap-2">
              {berths.filter(b => b.id.startsWith('U')).map((b) => {
                const isSelected = selectedSeats.includes(b.id);
                const isBooked = b.status === 'booked';
                return (
                  <button
                    key={b.id}
                    disabled={isBooked}
                    onClick={() => onToggleSeat(b.id)}
                    className={`h-12 rounded-lg text-xs font-semibold border flex items-center justify-center transition-all ${
                      isBooked
                        ? 'bg-red-950/40 border-red-900 text-red-700 cursor-not-allowed'
                        : isSelected
                        ? 'bg-terracotta border-terracotta text-white font-bold shadow-terracotta'
                        : 'bg-charcoal border-sand-500/30 text-slate-300 hover:border-cyan-400'
                    }`}
                  >
                    {b.id} ({b.tier.split(' ')[0]})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-6 text-xs text-slate-400">
      General admission passes will be reserved automatically.
    </div>
  );
}
