import React from 'react';
import { Award, Sparkles, Check, ArrowRight, ShieldCheck, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MembershipTiers({ onBookNow }) {
  const { user } = useAuth();
  const currentPoints = user?.rewardPoints || 0;

  const tiers = [
    {
      name: 'Basic Explorer',
      minPoints: 0,
      discount: 'Standard',
      multiplier: '1.0x',
      badge: 'Starter',
      color: 'border-slate-700 bg-slate-900/40 text-slate-300',
      perks: [
        'Standard unified booking access',
        'Earn 1 point per ₹100 spent',
        'Standard cancellation window'
      ]
    },
    {
      name: 'Silver Voyager',
      minPoints: 250,
      discount: '5% Flat Discount',
      multiplier: '1.25x',
      badge: 'Silver',
      color: 'border-blue-500/40 bg-blue-950/20 text-blue-300',
      perks: [
        '5% off select transport & cinema',
        '1.25x reward points multiplier',
        'Free seat & berth selection'
      ]
    },
    {
      name: 'Gold Elite',
      minPoints: 750,
      discount: '10% Instant Off',
      multiplier: '1.5x',
      badge: 'Popular',
      color: 'border-amber-500/50 bg-amber-950/25 text-amber-300 shadow-glow-purple',
      perks: [
        '10% off across all verticals',
        '1.5x reward points multiplier',
        'Priority boarding & lounge check-in',
        'Free cancellation up to 4 hours prior'
      ]
    },
    {
      name: 'Platinum Concierge',
      minPoints: 1500,
      discount: '15% VIP Discount',
      multiplier: '2.0x',
      badge: 'VIP Elite',
      color: 'border-purple-500/60 bg-purple-950/30 text-purple-300 shadow-glow-purple',
      perks: [
        '15% flat off everything',
        '2.0x double reward points',
        '24/7 dedicated personal concierge',
        'Complimentary luxury suite upgrades'
      ]
    }
  ];

  // Calculate progress to next tier
  const nextTierPoints = 1500;
  const progressPercent = Math.min(100, Math.round((currentPoints / nextTierPoints) * 100));

  return (
    <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center justify-center gap-1.5">
          <Crown className="w-4 h-4 text-amber-400" />
          Loyalty & Privileges
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
          Unlock Tiered Elite Status
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Earn 1 point for every ₹100 spent. Redeem points directly against payments for instant discounts.
        </p>

        {/* User Current Tier Status Card */}
        {user && (
          <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-4 glass-panel px-6 py-3.5 rounded-2xl border border-cyan-500/30 shadow-glow-cyan text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Your Balance</div>
                <div className="text-lg font-extrabold text-white flex items-center gap-1.5">
                  <span>{currentPoints} Points</span>
                  <span className="text-xs font-normal text-amber-300">({user.membership?.tierName})</span>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-48">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Next: Platinum</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-space-900 overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4 Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {tiers.map((t, idx) => {
          const isCurrent = user?.membership?.tierName.toLowerCase().includes(t.name.split(' ')[0].toLowerCase());

          return (
            <div
              key={idx}
              className={`glass-panel rounded-2xl p-5 border relative flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 ${t.color}`}
            >
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-500 text-space-950 font-bold text-[10px] tracking-wider uppercase shadow-glow-cyan">
                  Your Current Tier
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {t.badge}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/10">
                    {t.minPoints} pts
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-white">{t.name}</h3>

                <div className="mt-3 py-2 border-y border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Discount:</span>
                  <span className="font-bold text-white">{t.discount}</span>
                </div>

                <div className="py-2 border-b border-white/10 flex items-center justify-between text-xs mb-4">
                  <span className="text-slate-400">Multiplier:</span>
                  <span className="font-bold text-cyan-400">{t.multiplier}</span>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  {t.perks.map((p, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                      <span className="leading-snug">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4">
                <button
                  onClick={() => onBookNow && onBookNow()}
                  className="w-full py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Book & Earn Points</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
