import React from 'react';
import {
  Clock,
  Check,
  Users,
  Utensils,
  Building,
  Car,
  Ticket,
  Briefcase,
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function SlotSelector({
  inventory = {},
  selectedItems = [],
  onToggleItem
}) {
  // 1. SPORTS HOURLY TIME SLOTS
  if (inventory.type === 'TIME_SLOTS') {
    const slots = inventory.slots || [];

    return (
      <div className="w-full">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-gold-400" />
          Select Available 60-Minute Match Slot
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {slots.map((slot) => {
            const isSelected = selectedItems.includes(slot.id);
            const isBooked = slot.status === 'booked';
            const isHeld = slot.status === 'held';

            let style = 'bg-space-900/90 border-slate-700 text-slate-300 hover:border-cyan-400';
            if (isBooked) {
              style = 'bg-red-950/20 border-red-900/50 text-red-500 cursor-not-allowed opacity-60';
            } else if (isHeld) {
              style = 'bg-amber-950/30 border-amber-500/50 text-amber-300 cursor-not-allowed animate-pulse';
            } else if (isSelected) {
              style = 'bg-terracotta/25 border-terracotta text-warmwhite shadow-terracotta font-bold';
            }

            return (
              <button
                key={slot.id}
                disabled={isBooked || isHeld}
                onClick={() => onToggleItem(slot.id)}
                className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${style}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isBooked ? 'bg-red-500' : isHeld ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  <span className="font-medium">{slot.time}</span>
                </div>

                <div>
                  {isSelected ? (
                    <Check className="w-4 h-4 text-gold-300 stroke-[3]" />
                  ) : isBooked ? (
                    <span className="text-[10px] text-red-400 uppercase font-semibold">Booked</span>
                  ) : isHeld ? (
                    <span className="text-[10px] text-amber-400 uppercase font-semibold">Held</span>
                  ) : (
                    <span className="text-[11px] text-slate-400">₹{slot.price}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. RESTAURANT DINING TABLES
  if (inventory.type === 'RESTAURANT_TABLES') {
    const tables = inventory.tables || [];

    return (
      <div className="w-full">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Utensils className="w-4 h-4 text-gold-400" />
          Choose Dining Table Configuration
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tables.map((t) => {
            const isSelected = selectedItems.includes(t.id);
            const isBooked = t.status === 'booked';
            const isHeld = t.status === 'held';

            return (
              <div
                key={t.id}
                onClick={() => !isBooked && !isHeld && onToggleItem(t.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  isBooked
                    ? 'bg-red-950/20 border-red-900/40 opacity-50 cursor-not-allowed'
                    : isHeld
                    ? 'bg-amber-950/30 border-amber-500/50 cursor-not-allowed animate-pulse'
                    : isSelected
                    ? 'bg-terracotta/20 border-terracotta text-warmwhite shadow-terracotta'
                    : 'glass-panel hover:border-gold-400/50 text-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{t.label}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-gold-400" />
                      Up to {t.capacity} guests
                    </span>
                    <span>•</span>
                    <span className="text-amber-300 font-medium">Cover ₹{t.price}</span>
                  </div>
                </div>

                <div>
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-terracotta text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : isBooked ? (
                    <span className="text-[10px] text-red-400 uppercase font-semibold">Reserved</span>
                  ) : (
                    <span className="text-xs text-slate-400">Select</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. HOTEL ROOM TIERS
  if (inventory.type === 'ROOM_TIERS') {
    const rooms = inventory.rooms || [];

    return (
      <div className="w-full">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Building className="w-4 h-4 text-gold-400" />
          Select Luxury Room or Villa Category
        </div>

        <div className="space-y-3">
          {rooms.map((r) => {
            const isSelected = selectedItems.includes(r.id);

            return (
              <div
                key={r.id}
                onClick={() => onToggleItem(r.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-terracotta/20 border-terracotta text-warmwhite shadow-terracotta'
                    : 'glass-panel hover:border-gold-400/50 text-slate-300'
                }`}
              >
                <div>
                  <div className="text-sm font-bold text-white">{r.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                    <span>{r.bed}</span>
                    <span>•</span>
                    <span>Max {r.maxGuests} Guests</span>
                    <span>•</span>
                    <span className="text-emerald-400">{r.available} Available</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-white">
                      ₹{r.price.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-400">per night + tax</div>
                  </div>

                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                    isSelected ? 'bg-terracotta text-white border-cyan-300' : 'border-slate-700'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 4. CAB FLEET VEHICLE TIERS
  if (inventory.type === 'CAB_FLEET') {
    const vehicles = inventory.vehicles || [];

    return (
      <div className="w-full">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Car className="w-4 h-4 text-gold-400" />
          Choose Vehicle & Chauffeur Class
        </div>
        <p className="text-[11px] text-slate-400 mb-3.5">
          Includes sanitized executive vehicle, uniformed chauffeur, bottled water, live GPS & zero surge.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {vehicles.map((v) => {
            const isSelected = selectedItems.includes(v.id);
            const isBooked = v.status === 'booked';
            const isHeld = v.status === 'held';

            return (
              <div
                key={v.id}
                onClick={() => !isBooked && !isHeld && onToggleItem(v.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                  isBooked
                    ? 'bg-red-950/20 border-red-900/40 opacity-50 cursor-not-allowed'
                    : isHeld
                    ? 'bg-amber-950/30 border-amber-500/50 cursor-not-allowed animate-pulse'
                    : isSelected
                    ? 'bg-terracotta/20 border-terracotta text-warmwhite shadow-terracotta'
                    : 'glass-panel hover:border-gold-400/50 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span>{v.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                        {v.model}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-extrabold text-white">
                        ₹{v.price.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-400">all inclusive</div>
                    </div>
                  </div>

                  {/* Specs & Capacity */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-300 mt-2.5 pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-gold-400" />
                      {v.capacity} Seats
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-gold-400" />
                      {v.luggage} Bags
                    </span>
                  </div>

                  {/* Perks list */}
                  {v.perks && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {v.perks.slice(0, 2).map((perk, idx) => (
                        <span key={idx} className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5">
                          {perk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {v.available} available now
                  </span>

                  <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-terracotta text-white shadow-glow-cyan'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}>
                    {isSelected ? (
                      <>
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Selected</span>
                      </>
                    ) : (
                      <span>Select Vehicle</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 5. CONCERT & COMEDY EVENT PASSES
  if (inventory.type === 'EVENT_PASSES') {
    const passes = inventory.passes || [];

    return (
      <div className="w-full">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Ticket className="w-4 h-4 text-gold-400" />
          {inventory.eventType === 'CONCERT' ? 'Select Concert Festival Pass Tier' : 'Select Live Arena Comedy Tier'}
        </div>
        <p className="text-[11px] text-slate-400 mb-3.5 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-terracotta" />
          <span>{inventory.venue || 'Main Stadium Arena'} • Instant Dynamic QR Pass issued</span>
        </p>

        <div className="space-y-3">
          {passes.map((p) => {
            const isSelected = selectedItems.includes(p.id);
            const isBooked = p.status === 'booked';
            const isHeld = p.status === 'held';

            return (
              <div
                key={p.id}
                onClick={() => !isBooked && !isHeld && onToggleItem(p.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isBooked
                    ? 'bg-red-950/20 border-red-900/40 opacity-50 cursor-not-allowed'
                    : isHeld
                    ? 'bg-amber-950/30 border-amber-500/50 cursor-not-allowed animate-pulse'
                    : isSelected
                    ? 'bg-gradient-to-r from-terracotta/20 via-gold-500/10 to-transparent border-terracotta text-warmwhite shadow-terracotta'
                    : 'glass-panel hover:border-gold-400/50 text-slate-300'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{p.name}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-gold-300 border border-cyan-500/30">
                      Tier Pass
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {p.description}
                  </p>

                  {/* Perks Tags */}
                  {p.perks && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {p.perks.map((perk, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5 text-gold-400" />
                          {perk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <div className="text-left sm:text-right">
                    <div className="text-base font-black text-white">
                      ₹{p.price.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-medium">
                      {p.available} passes left
                    </div>
                  </div>

                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all ${
                    isSelected
                      ? 'bg-terracotta text-white border-cyan-300 shadow-glow-cyan'
                      : 'border-slate-700 bg-space-900 text-slate-400 hover:border-cyan-400'
                  }`}>
                    {isSelected ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <span className="text-xs font-bold">+</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 6. GENERAL ADMISSION / GENERAL UNITS (UNIVERSAL FALLBACK - NEVER BLANK!)
  const isSelected = selectedItems.includes('GENERAL-PASS') || selectedItems.length > 0;
  const price = inventory.price || 500;
  const available = inventory.availableTickets || inventory.available || inventory.capacity || 20;

  return (
    <div className="w-full">
      <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <Ticket className="w-4 h-4 text-gold-400" />
        General Admission & Experience Pass
      </div>

      <div
        onClick={() => onToggleItem('GENERAL-PASS')}
        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
          isSelected
            ? 'bg-terracotta/20 border-terracotta text-warmwhite shadow-terracotta'
            : 'glass-panel hover:border-gold-400/50 text-slate-300'
        }`}
      >
        <div>
          <div className="text-sm font-bold text-white">Standard Entry Pass</div>
          <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
            <span>Guaranteed Instant Entry</span>
            <span>•</span>
            <span className="text-emerald-400">{available} Available</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-extrabold text-white">
              ₹{price.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-400">per ticket</div>
          </div>

          <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
            isSelected ? 'bg-terracotta text-white border-cyan-300' : 'border-slate-700'
          }`}>
            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        </div>
      </div>
    </div>
  );
}
