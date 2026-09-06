const { getStore, logAudit } = require('../config/db');

exports.addReview = async (req, res) => {
  try {
    const { serviceId, userId = 2, rating, reviewText, bookingId } = req.body;
    const store = getStore();

    if (!serviceId || !rating || !reviewText) {
      return res.status(400).json({ success: false, message: 'Please provide rating and review text' });
    }

    const user = store.users.find(u => u.id === parseInt(userId)) || store.users[1];
    const service = store.services.find(s => s.id === parseInt(serviceId));

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const newReview = {
      id: store.reviews.length + 1,
      service_id: service.id,
      user_id: user.id,
      user_name: user.full_name,
      rating: parseInt(rating),
      review_text: reviewText,
      booking_id: bookingId || null,
      created_at: new Date().toISOString().split('T')[0]
    };

    store.reviews.unshift(newReview);

    // Update service rating and review count
    const serviceReviews = store.reviews.filter(r => r.service_id === service.id);
    const avg = serviceReviews.reduce((acc, r) => acc + r.rating, 0) / serviceReviews.length;
    service.rating = Math.round(avg * 100) / 100;
    service.review_count = serviceReviews.length;

    logAudit(user.id, 'ADD_REVIEW', 'reviews', newReview.id, {
      service: service.title,
      rating: newReview.rating
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your verified review has been published.',
      review: newReview,
      updatedRating: service.rating,
      totalReviews: service.review_count
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getServiceReviews = async (req, res) => {
  try {
    const serviceId = parseInt(req.params.serviceId);
    const store = getStore();
    const list = store.reviews.filter(r => r.service_id === serviceId);

    res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
