import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js';
import customerRoutes from './routes/customer.routes.js';
import orderRoutes from './routes/order.routes.js';

const app = express();

// Middleware
const allowedOrigins = [
  'https://omniretail-two.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. Postman, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
}));
app.use(morgan('dev'));
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.url}`);
  next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Basic health check route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'SPY_HEALTH_CHECK_OK' });
});
app.get('/v1/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'SPY_HEALTH_CHECK_OK' });
});

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/v1/users', userRoutes);

import dashboardRoutes from './routes/dashboard.routes.js';
import negotiationRoutes from './routes/negotiation.routes.js';
import productRoutes from './routes/product.routes.js';

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

export default app;
