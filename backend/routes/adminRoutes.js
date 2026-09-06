const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/analytics', adminController.getAnalytics);
router.get('/bookings', adminController.getAllBookings);
router.post('/services', adminController.createService);
router.put('/services/:id', adminController.updateService);
router.delete('/services/:id', adminController.deleteService);
router.get('/audit-logs', adminController.getAuditLogs);
router.get('/users', adminController.getUsers);
router.get('/database', adminController.getDatabaseExplorer);
router.post('/query', adminController.executeQuery);

module.exports = router;
