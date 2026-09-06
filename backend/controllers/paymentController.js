const { getStore, logAudit, addNotification } = require('../config/db');

exports.processPayment = async (req, res) => {
  try {
    const {
      bookingId,
      amount,
      paymentMethod = 'UPI',
      paymentDetails = {}
    } = req.body;

    const store = getStore();
    const txnSuffix = Math.floor(1000000000 + Math.random() * 9000000000);
    const transactionId = `TXN_${paymentMethod}_${txnSuffix}`;

    const paymentRecord = {
      id: Date.now(),
      payment_ref: `PAY-${txnSuffix.toString().slice(0, 6)}`,
      booking_id: bookingId,
      amount,
      payment_method: paymentMethod,
      transaction_id: transactionId,
      status: 'success',
      gateway_response: {
        gateway: 'BOOKSPHERE_MOCK_PAYMENT_V2',
        method: paymentMethod,
        timestamp: new Date().toISOString(),
        auth_code: 'AUTH_' + Math.random().toString(36).substring(2, 8).toUpperCase()
      },
      paid_at: new Date().toISOString()
    };

    logAudit(1, 'PAYMENT_SUCCESS', 'payments', paymentRecord.id, {
      method: paymentMethod,
      amount,
      transaction_id: transactionId
    });

    res.json({
      success: true,
      message: 'Payment processed successfully',
      payment: paymentRecord
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
