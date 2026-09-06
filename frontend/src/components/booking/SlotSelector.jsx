import React from 'react';
import { Clock, Check, Users, Utensils, Building } from 'lucide-react';

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
          <Clock className="w-4 h-4 text-cyan-400" />
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
              style = 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-glow-cyan font-bold';
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
                    <Check className="w-4 h-4 text-cyan-300 stroke-[3]" />
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
          <Utensils className="w-4 h-4 text-cyan-400" />
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
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-glow-cyan'
                    : 'glass-panel hover:border-cyan-500/40 text-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{t.label}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-cyan-400" />
                      Up to {t.capacity} guests
                    </span>
                    <span>•</span>
                    <span className="text-amber-300 font-medium">Cover ₹{t.price}</span>
                  </div>
                </div>

                <div>
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-cyan-400 text-space-950 flex items-center justify-center">
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
          <Building className="w-4 h-4 text-cyan-400" />
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
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-glow-cyan'
                    : 'glass-panel hover:border-cyan-500/40 text-slate-300'
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
                    isSelected ? 'bg-cyan-400 text-space-950 border-cyan-300' : 'border-slate-700'
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

  return null;
}
