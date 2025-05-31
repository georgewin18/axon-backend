const db = require('../config/db');

exports.getMonthlySales = async (req, res) => {
  try {
    const results = await db('payments')
      .select(db.raw("DATE_FORMAT(paymentDate, '%Y-%m') as month"))
      .sum('amount as total_sales')
      .groupByRaw("DATE_FORMAT(paymentDate, '%Y-%m')")
      .orderBy('month');

    res.json(results);
  } catch (err) {
    console.error('Query error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getTopProducts = async (req, res) => {
  try {
    const results = await db('orderdetails as od')
      .join('products as p', 'od.productCode', 'p.productCode')
      .select('p.productName')
      .sum('od.quantityOrdered as total_quantity')
      .groupBy('p.productName')
      .orderBy('total_quantity', 'desc')
      .limit(10);

    res.json(results);
  } catch (error) {
    console.error('Error fetching top products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getTopCustomers = async (req, res) => {
  try {
    const results = await db('payments as p')
      .join('customers as c', 'p.customerNumber', 'c.customerNumber')
      .select('c.customerName')
      .sum('p.amount as total_spent')
      .groupBy('c.customerName')
      .orderBy('total_spent', 'desc')
      .limit(10);

    res.json(results);
  } catch (error) {
    console.error('Error fetching top customers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getOrderStatusSummary = async (req, res) => {
  try {
    const results = await db('orders')
      .select('status')
      .count('* as total_orders')
      .groupBy('status');

    res.json(results);
  } catch (error) {
    console.error('Error fetching order status summary:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getSalesTrendByCategory = async (req, res) => {
  try {
    const results = await db('orderdetails as od')
      .join('orders as o', 'od.orderNumber', 'o.orderNumber')
      .join('products as p', 'od.productCode', 'p.productCode')
      .select(
        db.raw("DATE_FORMAT(o.orderDate, '%Y-%m') as month"),
        'p.productLine as category',
        db.raw('SUM(od.quantityOrdered * od.priceEach) as total_sales')
      )
      .groupByRaw("DATE_FORMAT(o.orderDate, '%Y-%m'), p.productLine")
      .orderBy(['month', 'category']);

    res.json(results);
  } catch (error) {
    console.error('Error fetching sales trend by category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
