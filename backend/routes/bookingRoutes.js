const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/hold', bookingController.holdReservation);
router.post('/release', bookingController.releaseReservation);
router.post('/', bookingController.createBooking);
router.get('/user', bookingController.getUserBookings);
router.post('/:id/cancel', bookingController.cancelBooking);
router.post('/waiting-list', bookingController.joinWaitingList);

module.exports = router;
