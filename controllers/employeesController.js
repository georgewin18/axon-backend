const db = require('../config/db');

exports.getCustomerDistributionPerEmployee = async (req, res) => {
  try {
    const results = await db('customers as c')
      .innerJoin('employees as e', 'c.salesRepEmployeeNumber', 'e.employeeNumber')
      .select(
        db.raw("CONCAT(e.firstName, ' ', e.lastName) as employee_name"),
        'e.employeeNumber'
      )
      .count('c.customerNumber as total_customers')
      .groupBy('e.employeeNumber', 'e.firstName', 'e.lastName')
      .orderBy('total_customers', 'desc');

    res.json(results);
  } catch (error) {
    console.error('Error fetching customer distribution per employee:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};  

exports.getTotalSalesPerEmployee = async (req, res) => {
  try {
    const results = await db('employees as e')
      .leftJoin('customers as c', 'e.employeeNumber', 'c.salesRepEmployeeNumber')
      .leftJoin('orders as o', 'c.customerNumber', 'o.customerNumber')
      .leftJoin('orderdetails as od', 'o.orderNumber', 'od.orderNumber')
      .select(
        db.raw("CONCAT(e.firstName, ' ', e.lastName) as employee_name"),
        'e.employeeNumber',
        db.raw('COALESCE(SUM(od.quantityOrdered * od.priceEach), 0) as total_sales')
      )
      .groupBy('e.employeeNumber', 'e.firstName', 'e.lastName')
      .orderBy('total_sales', 'desc');
  
    const filteredResults = results.filter(item => parseFloat(item.total_sales) > 0);
    res.json(filteredResults);
  } catch (error) {
    console.error('Error fetching total sales per employee:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
  
  
exports.getEmployeePerformanceByRegion = async (req, res) => {
  try {
    const results = await db('employees as e')
      .leftJoin('customers as c', 'e.employeeNumber', 'c.salesRepEmployeeNumber')
      .leftJoin('orders as o', 'c.customerNumber', 'o.customerNumber')
      .leftJoin('orderdetails as od', 'o.orderNumber', 'od.orderNumber')
      .whereNotNull('c.country') // hanya customer yang punya wilayah
      .whereNotNull('od.priceEach') // hanya data order yang valid
      .select(
        db.raw("CONCAT(e.firstName, ' ', e.lastName) as employee_name"),
        'e.employeeNumber',
        'c.country',
        db.raw('SUM(od.quantityOrdered * od.priceEach) as total_sales')
      )
      .groupBy('e.employeeNumber', 'e.firstName', 'e.lastName', 'c.country')
      .orderBy(['c.country', { column: 'total_sales', order: 'desc' }]);
    res.json(results);
  } catch (error) {
    console.error('Error fetching employee performance by region:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};  
  