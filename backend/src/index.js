const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const app = require('./app.js');

// Load env vars
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Only start the listener if we're not running on Vercel (serverless)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
