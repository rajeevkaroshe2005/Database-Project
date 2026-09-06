const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

router.get('/', serviceController.getServices);
router.get('/categories', serviceController.getCategories);
router.get('/locations', serviceController.getLocations);
router.get('/:id', serviceController.getServiceById);
router.get('/:id/inventory', serviceController.getServiceInventory);

module.exports = router;
