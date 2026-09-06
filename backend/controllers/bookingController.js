const { getStore, logAudit, addNotification } = require('../config/db');

// Hold seats/slots temporarily for 5 minutes
exports.holdReservation = async (req, res) => {
  try {
    const { serviceId, resourceIds, userId = 2 } = req.body;
    const store = getStore();
    const now = Date.now();
    const expiryTime = now + (5 * 60 * 1000); // 5 minutes

    if (!serviceId || !resourceIds || !resourceIds.length) {
      return res.status(400).json({ success: false, message: 'Invalid reservation parameters' });
    }

    // Check if any requested resource is currently held by someone else
    const conflict = store.tempReservations.find(r =>
      r.service_id === serviceId &&
      resourceIds.includes(r.resource_id) &&
      r.user_id !== userId &&
      r.expires_at > now
    );

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: `Resource ${conflict.resource_id} is temporarily held by another user. Please choose another.`
      });
    }

    // Remove any previous active holds by this user on these resources to refresh
    store.tempReservations = store.tempReservations.filter(r =>
      !(r.service_id === serviceId && r.user_id === userId && resourceIds.includes(r.resource_id))
    );

    // Add new 5-minute hold records
    resourceIds.forEach(id => {
      store.tempReservations.push({
        id: store.tempReservations.length + 1,
        service_id: serviceId,
        user_id: userId,
        resource_id: id,
        expires_at: expiryTime,
        created_at: now
      });
    });

    logAudit(userId, 'SEAT_HOLD_RESERVATION', 'seat_reservations_temp', serviceId, {
      resourceIds,
      held_until: new Date(expiryTime).toISOString()
    });

    res.json({
      success: true,
      message: 'Items held for 5 minutes',
      expiresAt: expiryTime,
      remainingSeconds: 300
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Release held seats if user backs out
exports.releaseReservation = async (req, res) => {
  try {
    const { serviceId, resourceIds, userId = 2 } = req.body;
    const store = getStore();

    store.tempReservations = store.tempReservations.filter(r =>
      !(r.service_id === serviceId && r.user_id === userId && resourceIds.includes(r.resource_id))
    );

    res.json({ success: true, message: 'Held reservations released' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create unified booking
exports.createBooking = async (req, res) => {
  try {
    const {
      serviceId,
      userId = 2,
      scheduledDate,
      scheduledTime,
      guestCount = 1,
      selectedItems = [], // e.g. ['A3', 'A4']
      passengers = [],
      couponCode,
      redeemPoints = 0,
      paymentMethod = 'UPI'
    } = req.body;

    const store = getStore();
    const service = store.services.find(s => s.id === parseInt(serviceId));
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const user = store.users.find(u => u.id === parseInt(userId)) || store.users[1];

    // Compute Base Price
    let baseAmount = 0;
    if (selectedItems.length > 0) {
      // Calculate based on items count or multipliers
      baseAmount = service.base_price * selectedItems.length;
    } else {
      baseAmount = service.base_price * Math.max(1, guestCount);
    }

    // Coupon discount logic
    let discountAmount = 0;
    let appliedCoupon = null;
    if (couponCode) {
      const coupon = store.coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.is_active);
      if (coupon && baseAmount >= coupon.min_spend) {
        appliedCoupon = coupon;
        if (coupon.discount_type === 'PERCENTAGE') {
          discountAmount = (baseAmount * coupon.discount_value) / 100;
          if (coupon.max_discount && discountAmount > coupon.max_discount) {
            discountAmount = coupon.max_discount;
          }
        } else {
          discountAmount = Math.min(coupon.discount_value, baseAmount);
        }
        coupon.times_used += 1;
      }
    }

    // Loyalty Points discount (1 point = ₹1, max 20% of base)
    let pointsDiscount = 0;
    const maxRedeemable = Math.min(user.reward_points, Math.floor(baseAmount * 0.20));
    if (redeemPoints > 0) {
      pointsDiscount = Math.min(redeemPoints, maxRedeemable);
      user.reward_points -= pointsDiscount;
    }

    const totalDiscount = discountAmount + pointsDiscount;
    const taxableAmount = Math.max(0, baseAmount - totalDiscount);
    const taxAmount = Math.round(taxableAmount * 0.18 * 100) / 100; // 18% GST
    const serviceFee = 40.00;
    const finalAmount = Math.round((taxableAmount + taxAmount + serviceFee) * 100) / 100;

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const bookingRef = `BK-2026-${randomSuffix}`;
    const qrCodeToken = `QR_${bookingRef}_VALIDATED_SECURE`;

    const newBooking = {
      id: store.bookings.length + 1,
      booking_ref: bookingRef,
      user_id: user.id,
      customer_name: user.full_name,
      customer_email: user.email,
      service_id: service.id,
      service_title: service.title,
      booking_type: service.parent_type,
      booking_date: new Date().toISOString().split('T')[0],
      scheduled_date: scheduledDate || new Date().toISOString().split('T')[0],
      scheduled_time: scheduledTime || '10:00 AM',
      guest_count: guestCount,
      selected_seats: selectedItems,
      passengers: passengers.length ? passengers : [{ name: user.full_name, phone: user.phone }],
      base_amount: baseAmount,
      discount_amount: totalDiscount,
      tax_amount: taxAmount,
      service_fee: serviceFee,
      final_amount: finalAmount,
      status: 'confirmed',
      qr_code_token: qrCodeToken,
      payment_method: paymentMethod,
      applied_coupon: appliedCoupon ? appliedCoupon.code : null,
      created_at: new Date().toISOString()
    };

    store.bookings.unshift(newBooking);

    // Release temporary holds for these items as they are now confirmed
    store.tempReservations = store.tempReservations.filter(r =>
      !(r.service_id === service.id && selectedItems.includes(r.resource_id))
    );

    // Trigger Emulation: Loyalty Points Earning (1 pt per ₹100 spent)
    const pointsEarned = Math.floor(finalAmount / 100);
    if (pointsEarned > 0) {
      user.reward_points += pointsEarned;
    }

    // Trigger Emulation: In-App Notification
    addNotification(
      user.id,
      'Booking Confirmed! 🎉',
      `Your booking for ${service.title} (${bookingRef}) is confirmed. Total: ₹${finalAmount.toLocaleString('en-IN')}`,
      'BOOKING',
      `/my-bookings?ref=${bookingRef}`
    );

    // Trigger Emulation: Audit Log
    logAudit(user.id, 'CONFIRM_BOOKING', 'bookings', newBooking.id, {
      booking_ref: bookingRef,
      amount: finalAmount,
      service: service.title,
      items: selectedItems
    });

    res.status(201).json({
      success: true,
      message: 'Booking successfully confirmed',
      booking: newBooking
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get User Bookings with status filters
exports.getUserBookings = async (req, res) => {
  try {
    const userId = parseInt(req.query.userId || '2');
    const status = req.query.status;
    const store = getStore();

    let list = store.bookings.filter(b => b.user_id === userId);

    if (status === 'upcoming') {
      list = list.filter(b => b.status === 'confirmed');
    } else if (status === 'completed') {
      list = list.filter(b => b.status === 'completed');
    } else if (status === 'cancelled') {
      list = list.filter(b => b.status === 'cancelled' || b.status === 'refunded');
    }

    res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Cancel Booking & Process Refund (Stored Procedure `sp_cancel_booking` emulation)
exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = parseInt(req.params.id);
    const { userId = 2, reason = 'Change of plans' } = req.body;
    const store = getStore();

    const booking = store.bookings.find(b => b.id === bookingId && b.user_id === parseInt(userId));

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found or unauthorized' });
    }

    if (booking.status !== 'confirmed') {
      return res.status(400).json({ success: false, message: 'This booking cannot be cancelled.' });
    }

    // 10% cancellation charge policy
    const cancellationFee = Math.round(booking.final_amount * 0.10 * 100) / 100;
    const refundAmount = Math.round((booking.final_amount - cancellationFee) * 100) / 100;

    booking.status = 'cancelled';
    booking.cancelled_at = new Date().toISOString();
    booking.cancellation_fee = cancellationFee;
    booking.refund_amount = refundAmount;

    // Trigger Emulation: In-app notification
    addNotification(
      userId,
      `Refund Processed ₹${refundAmount.toLocaleString('en-IN')}`,
      `Your booking ${booking.booking_ref} has been cancelled. Refund of ₹${refundAmount} has been credited.`,
      'REFUND',
      '/my-bookings'
    );

    // Trigger Emulation: Audit Log
    logAudit(userId, 'CANCEL_BOOKING', 'bookings', booking.id, {
      booking_ref: booking.booking_ref,
      original_amount: booking.final_amount,
      cancellation_fee: cancellationFee,
      refund_amount: refundAmount,
      reason
    });

    res.json({
      success: true,
      message: 'Booking cancelled successfully. Refund initiated.',
      refundDetails: {
        originalAmount: booking.final_amount,
        cancellationFee,
        refundAmount,
        refundStatus: 'Processed to source'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Join waiting list when full
exports.joinWaitingList = async (req, res) => {
  try {
    const { serviceId, userId = 2, date, slot } = req.body;
    const store = getStore();

    const entry = {
      id: Date.now(),
      service_id: serviceId,
      user_id: userId,
      desired_date: date,
      desired_slot: slot,
      status: 'WAITING',
      joined_at: new Date().toISOString()
    };

    logAudit(userId, 'JOIN_WAITING_LIST', 'services', serviceId, entry);

    addNotification(
      userId,
      'Added to Waiting List',
      'You are registered on the waiting list. We will notify you instantly if a seat or slot frees up!',
      'WAITING_LIST',
      '/my-bookings'
    );

    res.json({
      success: true,
      message: 'You have joined the waiting list. We will notify you immediately if a spot opens up!',
      entry
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
