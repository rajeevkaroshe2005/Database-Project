import React, { useState, useEffect } from 'react';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  XCircle,
  Star,
  Printer,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useCurrency } from '../../context/CurrencyContext';
import BoardingPassModal from '../booking/BoardingPassModal';

export default function MyBookings({ onBookNew }) {
  const { user, refreshProfile } = useAuth();
  const { refreshNotifications } = useNotifications();
  const { formatPrice } = useCurrency();

  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPassBooking, setSelectedPassBooking] = useState(null);

  // Cancellation Modal State
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('Change of travel plan');
  const [cancelLoading, setCancelLoading] = useState(false);

  // Review Modal State
  const [reviewBooking, setReviewBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchBookings = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await api.getUserBookings(user.id, activeTab);
      if (res.success) {
        setBookings(res.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user?.id, activeTab]);

  const handleConfirmCancel = async () => {
    if (!cancellingBooking) return;
    setCancelLoading(true);
    try {
      const res = await api.cancelBooking(cancellingBooking.id, user.id, cancelReason);
      if (res.success) {
        alert(`Booking cancelled! Refund of ₹${res.refundDetails.refundAmount.toLocaleString('en-IN')} has been initiated.`);
        setCancellingBooking(null);
        fetchBookings();
        refreshProfile();
        refreshNotifications();
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel booking');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewBooking || !reviewText) {
      alert('Please provide your review thoughts');
      return;
    }
    setReviewLoading(true);
    try {
      const res = await api.addReview({
        serviceId: reviewBooking.service_id,
        userId: user.id,
        bookingId: reviewBooking.id,
        rating,
        reviewText
      });
      if (res.success) {
        alert('Thank you! Your verified review has been published.');
        setReviewBooking(null);
        setReviewText('');
      }
    } catch (e) {
      alert(e.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
            Account Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            My Bookings & Reservations
          </h1>
        </div>

        <button
          onClick={onBookNew}
          className="btn-primary px-4 py-2 rounded-xl text-xs font-bold text-white shadow-terracotta self-start sm:self-auto"
        >
          + Book New Experience
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3 mb-6">
        {[
          { id: 'upcoming', label: 'Upcoming Confirmed' },
          { id: 'completed', label: 'Completed' },
          { id: 'cancelled', label: 'Cancelled & Refunded' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === t.id
                ? 'bg-surface text-warmwhite border border-gold-500/30 shadow-warm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="text-center py-16 text-xs text-slate-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-gold-400" />
          <span>Retrieving records from database...</span>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl border border-white/10 p-8 max-w-lg mx-auto">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No {activeTab} bookings found</h3>
          <p className="text-xs text-slate-400 mt-1 mb-5">
            You don't have any bookings matching this category.
          </p>
          <button
            onClick={onBookNew}
            className="glow-button px-5 py-2 rounded-xl text-xs font-bold text-white"
          >
            Browse Experiences
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-gold-500/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30">
                    {b.booking_type}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Ref: <strong className="text-white">{b.booking_ref}</strong>
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      b.status === 'confirmed'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : b.status === 'completed'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{b.service_title}</h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gold-400" />
                    <span>{b.scheduled_date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gold-400" />
                    <span>{b.scheduled_time}</span>
                  </div>
                  <div>
                    Units: <strong className="text-slate-200">{b.selected_seats?.join(', ') || `${b.guest_count} tickets`}</strong>
                  </div>
                  <div>
                    Paid: <strong className="text-white">{formatPrice(b.final_amount)}</strong>
                  </div>
                </div>
              </div>

              {/* QR Code & Action Buttons */}
              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-white/10">
                <div className="p-1.5 rounded-xl bg-white shadow-md">
                  <QRCodeSVG value={b.qr_code_token || b.booking_ref} size={50} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => setSelectedPassBooking(b)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface text-gold-300 hover:text-warmwhite border border-gold-500/30 flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Ticket className="w-3 h-3 text-gold-400" />
                    Pass / Ticket
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium glass-panel text-slate-300 hover:text-white hover:bg-white/10 flex items-center gap-1.5 border border-white/10"
                  >
                    <Printer className="w-3 h-3 text-gold-400" />
                    Invoice
                  </button>

                  {b.status === 'confirmed' && (
                    <button
                      onClick={() => setCancellingBooking(b)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 bg-red-950/20 border border-red-500/30 hover:bg-red-900/40 transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}

                  {b.status === 'completed' && (
                    <button
                      onClick={() => setReviewBooking(b)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300 bg-amber-950/20 border border-amber-500/30 hover:bg-amber-900/40 flex items-center gap-1"
                    >
                      <Star className="w-3 h-3" />
                      Write Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CANCELLATION & REFUND MODAL */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-md">
          <div className="glass-panel p-6 rounded-3xl border border-white/15 max-w-md w-full space-y-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Cancel Booking & Initiate Refund</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to cancel booking <strong>{cancellingBooking.booking_ref}</strong>?
            </p>

            {/* Refund Calculator Breakdown */}
            <div className="glass-panel p-3 rounded-xl border border-white/10 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Original Paid Amount:</span>
                <span>₹{cancellingBooking.final_amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-red-400">
                <span>Cancellation Fee (10%):</span>
                <span>- ₹{(cancellingBooking.final_amount * 0.1).toFixed(2)}</span>
              </div>
              <div className="pt-1.5 border-t border-white/10 flex justify-between font-bold text-emerald-400">
                <span>Refund Due to Original Source:</span>
                <span>₹{(cancellingBooking.final_amount * 0.9).toFixed(2)}</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Reason for Cancellation</label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCancellingBooking(null)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold glass-panel text-slate-300"
              >
                Keep Booking
              </button>
              <button
                disabled={cancelLoading}
                onClick={handleConfirmCancel}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white"
              >
                {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WRITE REVIEW MODAL */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-md">
          <div className="glass-panel p-6 rounded-3xl border border-white/15 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gold-400" />
              Review Your Experience
            </h3>
            <p className="text-xs text-slate-400">
              Verified review for {reviewBooking.service_title}
            </p>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <Star
                    key={num}
                    onClick={() => setRating(num)}
                    className={`w-6 h-6 cursor-pointer transition-colors ${
                      num <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Your Review</label>
              <textarea
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="How was the seat, ambience, service, or pitch quality?"
                className="w-full glass-input rounded-xl p-3 text-xs"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setReviewBooking(null)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold glass-panel text-slate-300"
              >
                Cancel
              </button>
              <button
                disabled={reviewLoading}
                onClick={handleSubmitReview}
                className="flex-1 glow-button py-2 rounded-xl text-xs font-bold text-white shadow-glow-cyan"
              >
                {reviewLoading ? 'Submitting...' : 'Post Review'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Boarding Pass / Cinema Ticket Stub Modal */}
      {selectedPassBooking && (
        <BoardingPassModal
          booking={selectedPassBooking}
          onClose={() => setSelectedPassBooking(null)}
        />
      )}
    </div>
  );
}
