const express = require('express');
const router = express.Router();
const customersController = require('../controllers/customersController');

router.get('/by-country', customersController.getCustomerCountByCountry);
router.get('/activity-status', customersController.getCustomerActivityStatus);
router.get('/top-spenders', customersController.getTopSpenderCustomers);
router.get('/orders-per-customer', customersController.getOrderCountPerCustomer);
router.get('/avg-orders-per-customer', customersController.getAverageOrdersPerCustomer);

module.exports = router;
