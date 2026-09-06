import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Tag,
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Users,
  Printer,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Ticket,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useCurrency } from '../../context/CurrencyContext';
import SeatSelector from './SeatSelector';
import SlotSelector from './SlotSelector';
import MockPaymentGateway from './MockPaymentGateway';

export default function BookingModal({
  service,
  onClose,
  onBookingSuccess
}) {
  const { user, refreshProfile } = useAuth();
  const { refreshNotifications } = useNotifications();
  const { formatPrice } = useCurrency();

  const [step, setStep] = useState(1); // 1: Inventory Selection, 2: Guest Details & Coupons, 3: Payment, 4: Confirmed
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduledTime, setScheduledTime] = useState('07:00 PM');
  const [inventory, setInventory] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [guestCount, setGuestCount] = useState(2);

  // Guest Details
  const [guestName, setGuestName] = useState(user?.fullName || 'Priya Nair');
  const [guestEmail, setGuestEmail] = useState(user?.email || 'priya.nair@example.com');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '+91 98450 67890');

  // Coupons & Rewards
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponApplied, setCouponApplied] = useState(null);
  const [redeemRewards, setRedeemRewards] = useState(false);

  // Temporary 5-Minute Hold Timer
  const [heldSeconds, setHeldSeconds] = useState(300); // 5:00
  const [isHolding, setIsHolding] = useState(false);

  // Confirmed booking state
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Load Inventory for selected date
  useEffect(() => {
    if (service?.id) {
      api.getServiceInventory(service.id, scheduledDate)
        .then((res) => {
          if (res.success) {
            setInventory(res.inventory || {});
          }
        })
        .catch(console.error);
    }
  }, [service?.id, scheduledDate]);

  // 5-Minute Timer Countdown effect
  useEffect(() => {
    let timer = null;
    if (isHolding && heldSeconds > 0) {
      timer = setInterval(() => {
        setHeldSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsHolding(false);
            alert('Your temporary reservation has expired. Please re-select your seats.');
            setSelectedItems([]);
            setStep(1);
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isHolding, heldSeconds]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Step 1 -> Step 2: Acquire Temporary 5-minute Hold in Database
  const handleProceedToDetails = async () => {
    if (inventory.type !== 'GENERAL_ADMISSION' && selectedItems.length === 0) {
      alert('Please select at least one seat, slot, or room to proceed.');
      return;
    }

    try {
      if (selectedItems.length > 0) {
        const res = await api.holdReservation(service.id, selectedItems, user?.id || 2);
        if (res.success) {
          setIsHolding(true);
          setHeldSeconds(300);
        }
      }
      setStep(2);
    } catch (err) {
      alert(err.message || 'Seat temporarily unavailable.');
    }
  };

  // Coupon Validation
  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponError('');
    try {
      const res = await api.validateCoupon(couponCode, rawBaseAmount);
      if (res.success) {
        setCouponDiscount(res.discount);
        setCouponApplied(res);
      }
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code');
      setCouponDiscount(0);
      setCouponApplied(null);
    }
  };

  // Price Calculation Breakdown
  const itemsCount = selectedItems.length > 0 ? selectedItems.length : Math.max(1, guestCount);
  const rawBaseAmount = service.base_price * itemsCount;
  const rewardPointsDiscount = redeemRewards ? Math.min(user?.rewardPoints || 0, Math.floor(rawBaseAmount * 0.2)) : 0;
  const totalDiscount = couponDiscount + rewardPointsDiscount;
  const taxableAmount = Math.max(0, rawBaseAmount - totalDiscount);
  const gstTax = Math.round(taxableAmount * 0.18 * 100) / 100;
  const serviceFee = 40.0;
  const finalTotal = Math.round((taxableAmount + gstTax + serviceFee) * 100) / 100;

  // Step 3 -> Payment Completion
  const handlePaymentSuccess = async (paymentResult) => {
    try {
      const payload = {
        serviceId: service.id,
        userId: user?.id || 2,
        scheduledDate,
        scheduledTime,
        guestCount: itemsCount,
        selectedItems,
        passengers: [{ name: guestName, phone: guestPhone }],
        couponCode: couponApplied?.code,
        redeemPoints: rewardPointsDiscount,
        paymentMethod: paymentResult.method
      };

      const res = await api.createBooking(payload);
      if (res.success) {
        setConfirmedBooking(res.booking);
        setStep(4);
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
        refreshProfile();
        refreshNotifications();
        if (onBookingSuccess) onBookingSuccess(res.booking);
      }
    } catch (err) {
      alert(err.message || 'Booking confirmation failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-space-950/80 backdrop-blur-xl animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] glass-panel rounded-3xl border border-white/15 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step > 1 && step < 4 && (
              <button
                onClick={() => setStep(step - 1)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                Unified Reservation System
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white truncate max-w-sm sm:max-w-md">
                {service.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 5-Minute Countdown Indicator */}
            {isHolding && step < 4 && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold animate-pulse">
                <Clock className="w-3.5 h-3.5" />
                <span>Seat held: {formatTimer(heldSeconds)}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: SELECT SEATS / SLOTS */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Date & Time Selector */}
              <div className="grid grid-cols-2 gap-3 glass-panel p-3.5 rounded-2xl border border-white/10">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-cyan-400" />
                    Reservation Date
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    Preferred Time
                  </label>
                  <select
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-1.5 text-xs"
                  >
                    <option value="10:00 AM" className="bg-space-900">10:00 AM - 11:00 AM</option>
                    <option value="02:00 PM" className="bg-space-900">02:00 PM - 03:00 PM</option>
                    <option value="07:00 PM" className="bg-space-900">07:00 PM - 08:00 PM</option>
                    <option value="09:30 PM" className="bg-space-900">09:30 PM - 10:30 PM</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Interactive Inventory Layout */}
              {inventory.type === 'SEAT_GRID' || inventory.type === 'FLIGHT_CABIN' || inventory.type === 'BUS_BERTHS' ? (
                <SeatSelector
                  serviceType={service.parent_type}
                  categorySlug={service.category_slug}
                  inventory={inventory}
                  selectedSeats={selectedItems}
                  onToggleSeat={toggleItem}
                />
              ) : (
                <SlotSelector
                  inventory={inventory}
                  selectedItems={selectedItems}
                  onToggleItem={toggleItem}
                />
              )}

              {/* Step 1 Footer Action */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Selected Units</span>
                  <span className="text-sm font-extrabold text-white">
                    {selectedItems.length > 0 ? selectedItems.join(', ') : 'None selected'}
                  </span>
                </div>

                <button
                  onClick={handleProceedToDetails}
                  className="glow-button px-6 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-glow-cyan"
                >
                  <span>Proceed to Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: GUEST DETAILS & COUPONS */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Lead Guest / Passenger Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Mobile Phone</label>
                    <input
                      type="text"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-slate-400 block mb-1">Email (Ticket Delivery)</label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-cyan-400" />
                    Promotional Coupon
                  </span>
                  <span className="text-[11px] text-slate-400">Try: WELCOME10, SPORTS20, FIRSTBOOK</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 glass-input rounded-xl px-3 py-2 text-xs uppercase font-mono"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30"
                  >
                    Apply
                  </button>
                </div>

                {couponError && (
                  <div className="text-[11px] text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {couponError}
                  </div>
                )}

                {couponApplied && (
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {couponApplied.description} (Saved ₹{couponDiscount})
                  </div>
                )}
              </div>

              {/* Loyalty Reward Points Redemption */}
              {user && user.rewardPoints > 0 && (
                <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 bg-amber-950/15 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Award className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="text-xs font-bold text-white">Redeem Loyalty Reward Points</div>
                      <div className="text-[11px] text-slate-400">
                        You have {user.rewardPoints} points available. (1 point = ₹1)
                      </div>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={redeemRewards}
                      onChange={(e) => setRedeemRewards(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-space-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                  </label>
                </div>
              )}

              {/* Complete Price Breakdown (DBMS / Accounting Requirement) */}
              <div className="glass-panel p-4 rounded-2xl border border-white/10 text-xs space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Base Price ({itemsCount} units @ {formatPrice(service.base_price)})</span>
                  <span>{formatPrice(rawBaseAmount)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Coupon Discount ({couponApplied?.code})</span>
                    <span>- {formatPrice(couponDiscount)}</span>
                  </div>
                )}
                {rewardPointsDiscount > 0 && (
                  <div className="flex justify-between text-amber-400 font-medium">
                    <span>Reward Points Redemption</span>
                    <span>- {formatPrice(rewardPointsDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>GST (18% Statutory)</span>
                  <span>+ {formatPrice(gstTax)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Booking & Platform Fee</span>
                  <span>+ {formatPrice(serviceFee)}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-base font-extrabold text-white">
                  <span>Final Total</span>
                  <span className="text-cyan-400">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setStep(3)}
                className="w-full glow-button py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-glow-cyan"
              >
                <span>Proceed to Payment ({formatPrice(finalTotal)})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 3: MOCK PAYMENT GATEWAY */}
          {step === 3 && (
            <MockPaymentGateway
              amount={finalTotal}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentCancel={() => setStep(2)}
            />
          )}

          {/* STEP 4: BOOKING CONFIRMATION & INVOICE */}
          {step === 4 && confirmedBooking && (
            <div className="space-y-6 text-center">
              {/* Success Banner */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-glow-cyan mb-2">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-white">Booking Confirmed!</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Reference: <span className="font-mono text-cyan-400 font-bold">{confirmedBooking.booking_ref}</span>
                </p>
              </div>

              {/* Printable Digital Pass / Tax Invoice */}
              <div className="glass-panel p-5 rounded-2xl border border-white/10 text-left space-y-4 print:bg-white print:text-black">
                <div className="flex items-start justify-between border-b border-white/10 pb-3">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Service</div>
                    <div className="text-sm font-bold text-white">{service.title}</div>
                    <div className="text-xs text-slate-400">{service.city} • {confirmedBooking.scheduled_date} at {confirmedBooking.scheduled_time}</div>
                  </div>

                  <div className="p-2 rounded-xl bg-white">
                    <QRCodeSVG value={confirmedBooking.qr_code_token} size={70} />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Passenger</span>
                    <span className="font-semibold text-white">{guestName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Seats / Slot</span>
                    <span className="font-semibold text-white">{selectedItems.join(', ') || 'Confirmed'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Payment</span>
                    <span className="font-semibold text-emerald-400">{confirmedBooking.payment_method} (Paid)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Total Paid</span>
                    <span className="font-extrabold text-white">{formatPrice(confirmedBooking.final_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold glass-panel text-white hover:bg-white/10 flex items-center justify-center gap-2 border border-white/10"
                >
                  <Printer className="w-4 h-4 text-cyan-400" />
                  Print Tax Invoice
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 glow-button py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-glow-cyan"
                >
                  Done & Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
