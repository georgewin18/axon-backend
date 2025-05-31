const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const salesRoutes = require('./routes/sales');
app.use('/sales', salesRoutes);

const customerRoutes = require('./routes/customers');
app.use('/customers', customerRoutes);

const employeeRoutes = require('./routes/employees');
app.use('/employees', employeeRoutes);

// Server listen
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
