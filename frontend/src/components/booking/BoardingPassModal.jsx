import React from 'react';
import { X, Plane, Film, Trophy, Building, Utensils, Printer, Download, Sparkles, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function BoardingPassModal({ booking, onClose }) {
  if (!booking) return null;

  const isTransport = booking.booking_type === 'TRANSPORT';
  const isCinema = booking.booking_type === 'ENTERTAINMENT';
  const isSports = booking.booking_type === 'SPORTS';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/90 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-white/20 shadow-2xl p-6 space-y-6">
        {/* Top Controls */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-400">
            <Sparkles className="w-4 h-4" />
            <span>Digital Boarding Pass & Priority Ticket</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl glass-panel text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 border border-white/10"
            >
              <Printer className="w-3.5 h-3.5 text-gold-400" />
              Print Pass
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Physical Stylized Pass Container */}
        <div className="relative rounded-3xl bg-gradient-to-r from-charcoal via-surface to-charcoal border border-gold-500/30 shadow-luxury shadow-2xl overflow-hidden text-white flex flex-col md:flex-row print:bg-white print:text-black print:border-black">
          {/* Main Body Pass */}
          <div className="flex-1 p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold-400 block">
                  BOOKSPHERE PASS
                </span>
                <h3 className="text-lg font-extrabold text-white">{booking.service_title}</h3>
              </div>
              <div className="p-2 rounded-xl bg-white/10 border border-white/10">
                {isTransport ? <Plane className="w-5 h-5 text-cyan-300" /> : isCinema ? <Film className="w-5 h-5 text-rose-400" /> : <Trophy className="w-5 h-5 text-emerald-400" />}
              </div>
            </div>

            {/* Grid of Key Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div>
                <span className="text-[10px] uppercase text-slate-400 block">Passenger / Guest</span>
                <span className="font-bold text-white uppercase">{booking.customer_name || 'Guest Explorer'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 block">Date</span>
                <span className="font-bold text-white">{booking.scheduled_date}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 block">Time</span>
                <span className="font-bold text-white">{booking.scheduled_time}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 block">Seat / Units</span>
                <span className="font-mono font-black text-gold-400 text-sm">
                  {booking.selected_seats?.join(', ') || `${booking.guest_count} Seats`}
                </span>
              </div>
            </div>

            {/* Barcode Lines Simulation */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-7 w-48 bg-gradient-to-r from-white via-slate-400 to-white opacity-80 rounded flex items-center justify-center font-mono text-[9px] text-space-950 tracking-[6px] font-bold select-none">
                  ||||| | |||| ||| |||| |
                </div>
                <div className="text-[9px] font-mono text-slate-400">
                  REF: {booking.booking_ref} • SECURE PASS
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="text-[10px] text-slate-400 block uppercase">Gate / Audi</span>
                <span className="font-extrabold text-white text-sm">T2 • Gate 4</span>
              </div>
            </div>
          </div>

          {/* Perforated Stub Divider */}
          <div className="relative border-t md:border-t-0 md:border-l-2 border-dashed border-white/20 p-6 bg-espresso/60 flex flex-col items-center justify-center gap-3">
            <div className="p-2 rounded-xl bg-white shadow-lg">
              <QRCodeSVG value={booking.qr_code_token || booking.booking_ref} size={80} />
            </div>
            <div className="text-center">
              <span className="text-[10px] font-mono font-bold text-gold-400 block">{booking.booking_ref}</span>
              <span className="text-[9px] text-slate-400 uppercase">Boarding Pass Stub</span>
            </div>
          </div>
        </div>

        {/* Action Hint */}
        <div className="text-center text-xs text-slate-400">
          Present this digital QR ticket or printed boarding pass at the counter or turnstile.
        </div>
      </div>
    </div>
  );
}
