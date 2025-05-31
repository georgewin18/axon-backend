const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeesController');

router.get('/customer-distribution', employeeController.getCustomerDistributionPerEmployee);
router.get('/total-sales', employeeController.getTotalSalesPerEmployee);
router.get('/performance-by-region', employeeController.getEmployeePerformanceByRegion);

module.exports = router;
