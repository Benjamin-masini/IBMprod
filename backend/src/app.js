const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Auth & User routes
app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/users', require('./modules/user/user.routes'));

// Feature routes
app.use('/api/events', require('./modules/event/event.routes'));
app.use('/api/search', require('./core/search/search.routes'));
app.use('/api/payments', require('./core/payments/payment.routes'));
app.use('/api/admin', require('./core/admin/admin.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
