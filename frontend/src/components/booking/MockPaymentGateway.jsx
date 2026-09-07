import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  Banknote,
  ShieldCheck,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function MockPaymentGateway({
  amount,
  onPaymentSuccess,
  onPaymentCancel
}) {
  const [method, setMethod] = useState('UPI');
  const [status, setStatus] = useState('idle'); // idle | processing | success | failed

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardHolder, setCardHolder] = useState('PRIYA NAIR');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('883');

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // UPI State
  const [vpa, setVpa] = useState('priya@okhdfcbank');

  const indianBanks = [
    { id: 'HDFC', name: 'HDFC Bank' },
    { id: 'ICICI', name: 'ICICI Bank' },
    { id: 'SBI', name: 'State Bank of India' },
    { id: 'AXIS', name: 'Axis Bank' },
    { id: 'KOTAK', name: 'Kotak Mahindra' }
  ];

  const handlePay = () => {
    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onPaymentSuccess({
          method,
          transactionId: `TXN_${method}_${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          amount
        });
      }, 1200);
    }, 2000);
  };

  return (
    <div className="w-full">
      {/* Security Banner */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-xs">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span className="font-semibold">Mock 256-Bit SSL Encrypted Gateway</span>
        </div>
        <div className="text-slate-400 flex items-center gap-1">
          <Lock className="w-3 h-3" />
          <span>Test Sandbox</span>
        </div>
      </div>

      {/* Payment Method Selector Tabs */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {[
          { id: 'UPI', label: 'UPI / QR', icon: QrCode },
          { id: 'CREDIT_CARD', label: 'Card', icon: CreditCard },
          { id: 'NET_BANKING', label: 'Net Banking', icon: Building2 },
          { id: 'WALLET', label: 'Wallet', icon: Wallet },
        ].map((m) => {
          const Icon = m.icon;
          const isSelected = method === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                isSelected
                  ? 'bg-terracotta/20 border-terracotta text-warmwhite shadow-terracotta'
                  : 'glass-panel hover:bg-white/5 text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* UPI TAB CONTENT */}
      {method === 'UPI' && (
        <div className="glass-panel p-4 rounded-xl border border-white/10 text-center">
          <div className="inline-block p-3 rounded-xl bg-white shadow-lg mb-3">
            <QRCodeSVG
              value={`upi://pay?pa=booksphere@icici&pn=BookSphere&am=${amount}&cu=INR`}
              size={130}
              level="M"
            />
          </div>
          <div className="text-xs font-bold text-white mb-1">Scan with any UPI App</div>
          <div className="text-[11px] text-slate-400">GPay • PhonePe • Paytm • BHIM • CRED</div>

          <div className="my-3 flex items-center gap-2">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">or enter UPI ID</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <input
            type="text"
            value={vpa}
            onChange={(e) => setVpa(e.target.value)}
            placeholder="username@bank"
            className="w-full glass-input rounded-xl px-3 py-2 text-xs text-center font-mono"
          />
        </div>
      )}

      {/* CARD TAB CONTENT */}
      {method === 'CREDIT_CARD' && (
        <div className="space-y-3">
          {/* Animated Card Preview */}
          <div className="relative h-40 rounded-2xl p-5 bg-gradient-to-tr from-charcoal via-surface to-charcoal border border-gold-500/30 border border-white/20 shadow-2xl overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-center text-white">
              <span className="text-xs font-mono font-bold tracking-widest uppercase">BookSphere Black Card</span>
              <span className="text-sm font-extrabold italic">VISA</span>
            </div>

            <div className="font-mono text-base tracking-widest text-white font-bold my-1">
              {cardNumber}
            </div>

            <div className="flex justify-between items-end text-xs text-white">
              <div>
                <span className="text-[9px] uppercase tracking-wider block text-gold-300">Cardholder</span>
                <span className="font-semibold uppercase">{cardHolder}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider block text-gold-300">Expires</span>
                <span className="font-semibold">{cardExpiry}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="col-span-2">
              <label className="text-[11px] text-slate-400 block mb-1">Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Valid Thru</label>
              <input
                type="text"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">CVV</label>
              <input
                type="password"
                maxLength={3}
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 font-mono text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* NET BANKING */}
      {method === 'NET_BANKING' && (
        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-2">
          <label className="text-xs text-slate-300 font-semibold block mb-2">Select Your Bank</label>
          <div className="grid grid-cols-2 gap-2">
            {indianBanks.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBank(b.id)}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                  selectedBank === b.id
                    ? 'bg-terracotta/20 border-terracotta text-warmwhite'
                    : 'bg-space-900 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* WALLET */}
      {method === 'WALLET' && (
        <div className="glass-panel p-4 rounded-xl border border-white/10 text-xs text-slate-300 space-y-2">
          <div className="font-semibold text-white mb-2">Popular Wallets</div>
          <div className="flex gap-2">
            {['Paytm Wallet', 'Amazon Pay', 'PhonePe Wallet'].map((w) => (
              <div key={w} className="p-2.5 rounded-xl border border-white/10 bg-space-900 text-center flex-1 cursor-pointer hover:border-cyan-400">
                {w}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Pay Button */}
      <div className="mt-6 pt-3 border-t border-white/10">
        <button
          disabled={status === 'processing' || status === 'success'}
          onClick={handlePay}
          className="w-full btn-primary py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-terracotta"
        >
          {status === 'processing' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Simulating Secure Gateway Verification...</span>
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Payment Verified! Confirming Booking...</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Pay ₹{amount.toLocaleString('en-IN')} (Mock Payment)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
