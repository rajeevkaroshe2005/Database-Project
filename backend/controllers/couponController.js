const { getStore } = require('../config/db');

exports.validateCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;
    const store = getStore();

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide a coupon code' });
    }

    const coupon = store.coupons.find(
      c => c.code.toUpperCase() === code.trim().toUpperCase() && c.is_active
    );

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive promo code.' });
    }

    const bookingAmount = parseFloat(amount || 0);

    if (bookingAmount < coupon.min_spend) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${coupon.min_spend.toLocaleString('en-IN')} required for coupon ${coupon.code}.`
      });
    }

    let discount = 0;
    if (coupon.discount_type === 'PERCENTAGE') {
      discount = (bookingAmount * coupon.discount_value) / 100;
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else {
      discount = Math.min(coupon.discount_value, bookingAmount);
    }

    discount = Math.round(discount * 100) / 100;

    res.json({
      success: true,
      code: coupon.code,
      discount,
      description: coupon.description,
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCoupons = async (req, res) => {
  try {
    const store = getStore();
    res.json({
      success: true,
      data: store.coupons.filter(c => c.is_active)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
