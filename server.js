const express = require('express');
const connectDB = require('./config/db');
const { setupSecurity } = require('./middleware/security');
const compression = require('compression');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

// Connect to database
connectDB();

const app = express();

// Security middleware (includes CORS configuration)
setupSecurity(app);

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('dev'));

// Body parser
app.use(express.json());

// Log all API requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ngos', require('./routes/ngos'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/notifications', require('./routes/notifications'));

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});



const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 