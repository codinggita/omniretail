const express = require('express');
const cors = require('cors');

// ─── Import all route files
const userRoutes = require('./routes/user.routes.js');
const dashboardRoutes = require('./routes/dashboard.routes.js');
const negotiationRoutes = require('./routes/negotiation.routes.js');
const productRoutes = require('./routes/product.routes.js');
const orderRoutes = require('./routes/order.routes.js');
const customerRoutes = require('./routes/customer.routes.js');
const storeRoutes = require('./routes/store.routes.js');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
const allowedOrigins = [
  'https://omniretail-two.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
}));
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.url}`);
  next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'SPY_HEALTH_CHECK_OK' });
});
app.get('/v1/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'SPY_HEALTH_CHECK_OK' });
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/v1/users', userRoutes);
app.use('/v1/users', userRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/v1/dashboard', dashboardRoutes);
app.use('/api/v1/negotiations', negotiationRoutes);
app.use('/v1/negotiations', negotiationRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/v1/orders', orderRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/v1/customers', customerRoutes);
app.use('/api/v1/stores', storeRoutes);
app.use('/v1/stores', storeRoutes);

module.exports = app;

