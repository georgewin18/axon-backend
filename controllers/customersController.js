const db = require('../config/db');

exports.getCustomerCountByCountry = async (req, res) => {
  try {
    const results = await db('customers')
      .select('country')
      .count('* as total_customers')
      .groupBy('country')
      .orderBy('total_customers', 'desc');

    res.json(results);
  } catch (error) {
    console.error('Error fetching customer count by country:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getCustomerActivityStatus = async (req, res) => {
  try {
    const subquery = db('customers as c')
      .leftJoin('orders as o', 'c.customerNumber', 'o.customerNumber')
      .select(
        'c.customerNumber',
        db.raw(`
          CASE 
            WHEN o.customerNumber IS NOT NULL THEN 'Active'
            ELSE 'Inactive'
          END AS status
        `)
      );

    const results = await db
      .from(subquery.as('customer_status'))
      .select('status')
      .countDistinct('customerNumber as total_customers')
      .groupBy('status');

    res.json(results);
  } catch (error) {
    console.error('Error fetching customer activity status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getTopSpenderCustomers = async (req, res) => {
  try {
    const results = await db('customers as c')
      .join('payments as p', 'c.customerNumber', 'p.customerNumber')
      .select('c.customerName')
      .sum('p.amount as total_spent')
      .groupBy('c.customerName')
      .orderBy('total_spent', 'desc')
      .limit(10);

    res.json(results);
  } catch (error) {
    console.error('Error fetching top spender customers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getOrderCountPerCustomer = async (req, res) => {
  try {
    const results = await db('customers as c')
      .leftJoin('orders as o', 'c.customerNumber', 'o.customerNumber')
      .select('c.customerName')
      .count('o.orderNumber as total_orders')
      .groupBy('c.customerName')
      .having('total_orders', '>', 0)   // Filter di sini
      .orderBy('total_orders', 'desc');

    res.json(results);
  } catch (error) {
    console.error('Error fetching order count per customer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAverageOrdersPerCustomer = async (req, res) => {
  try {
    const subquery = db('customers as c')
      .leftJoin('orders as o', 'c.customerNumber', 'o.customerNumber')
      .select('c.customerNumber')
      .count('o.orderNumber as order_count')
      .groupBy('c.customerNumber')
      .as('customer_orders');

    const result = await db(subquery)
      .avg('order_count as avg_orders_per_customer');

    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching average orders per customer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
