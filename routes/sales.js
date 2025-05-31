const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

router.get('/monthly', salesController.getMonthlySales);
router.get('/top-products', salesController.getTopProducts);
router.get('/top-customers', salesController.getTopCustomers);
router.get('/order-status', salesController.getOrderStatusSummary);
router.get('/sales-trend-by-category', salesController.getSalesTrendByCategory);

module.exports = router;
