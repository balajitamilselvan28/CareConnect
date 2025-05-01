const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Specific limiters
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // increased limit for testing
  message: 'Too many login attempts, please try again after an hour'
});

const commentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many comments, please try again after 15 minutes'
});

// CORS options
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Security middleware setup
const setupSecurity = (app) => {
  // Basic security headers
  app.use(helmet());
  
  // Prevent XSS attacks
  app.use(xss());
  
  // Prevent HTTP Parameter Pollution
  app.use(hpp());
  
  // CORS
  app.use(cors(corsOptions));
  
  // Rate limiting
  app.use('/api/', apiLimiter);
  app.use('/api/auth', authLimiter);
  app.use('/api/posts/:postId/comments', commentLimiter);
};

module.exports = {
  setupSecurity,
  apiLimiter,
  authLimiter,
  commentLimiter
}; 