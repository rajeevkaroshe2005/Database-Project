import React from 'react';
import { Compass, Database, ShieldCheck, Heart, Github } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="border-t border-sand-300/80 bg-[#F2EDE4] mt-0 text-xs text-charcoal/70 border-t border-sand-300/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-gold-500 via-terracotta to-sand-400 p-0.5 shadow-warm">
                <div className="w-full h-full bg-charcoal rounded-[7px] flex items-center justify-center">
                  <Compass className="w-4 h-4 text-gold-400" />
                </div>
              </div>
              <span className="text-base font-extrabold text-espresso font-serif">BOOKSPHERE</span>
            </div>
            <p className="text-charcoal/70 leading-relaxed text-[11px]">
              The unified online booking & reservation engine. Covering transport, movies, concerts, turfs, luxury hotels, and dining.
            </p>
            <div className="flex items-center gap-1.5 text-gold-400 font-medium text-[11px]">
              <Database className="w-3.5 h-3.5" />
              <span>MySQL 8.0 Normalized Relational Architecture</span>
            </div>
          </div>

          {/* Quick Verticals */}
          <div>
            <div className="font-bold text-espresso uppercase tracking-wider text-[11px] mb-3">
              Verticals
            </div>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => onNavigate('transport')} className="hover:text-terracotta">Flight & Rail Reservations</button></li>
              <li><button onClick={() => onNavigate('entertainment')} className="hover:text-terracotta">IMAX & Arena Concerts</button></li>
              <li><button onClick={() => onNavigate('sports')} className="hover:text-terracotta">AstroTurf & Olympic Pools</button></li>
              <li><button onClick={() => onNavigate('hotel')} className="hover:text-terracotta">Oceanfront Villas & Hotels</button></li>
              <li><button onClick={() => onNavigate('restaurant')} className="hover:text-terracotta">Rooftop Sky Lounges</button></li>
            </ul>
          </div>

          {/* DBMS & System Features */}
          <div>
            <div className="font-bold text-espresso uppercase tracking-wider text-[11px] mb-3">
              DBMS Concepts
            </div>
            <ul className="space-y-1.5 text-[11px]">
              <li>• 25 Normalized Tables (3NF)</li>
              <li>• ACID Transactions with Rollback</li>
              <li>• Real-Time 5-Min Seat Locks</li>
              <li>• MySQL Triggers & Stored Procedures</li>
              <li>• Full System Audit Logging</li>
            </ul>
          </div>

          {/* Technology Stack */}
          <div>
            <div className="font-bold text-espresso uppercase tracking-wider text-[11px] mb-3">
              Built With
            </div>
            <p className="text-[11px] text-charcoal/60 leading-relaxed mb-3">
              React, Vite, Three.js, React Three Fiber, Tailwind CSS, Express.js REST API & MySQL 8.
            </p>
            <div className="p-3 rounded-xl bg-white border border-sand-300 text-[10px] text-slate-300">
              College DBMS Project Demo • Production UI Benchmark
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-sand-300/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div>
            © 2026 BOOKSPHERE. Online Booking & Reservation System. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-charcoal/60">
            <span>Crafted with precision for next-generation bookings</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
