const mongoose = require('mongoose');

const connectDB = async () => {
  const maxRetries = 5;
  let retryCount = 0;

  const connectWithRetry = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        family: 4, // Use IPv4, skip trying IPv6
        maxPoolSize: 10, // Maintain up to 10 socket connections
        minPoolSize: 5, // Maintain at least 5 socket connections
        retryWrites: true,
        w: 'majority', // Write concern
        wtimeoutMS: 2500, // Write concern timeout
      });

      console.log(`MongoDB Connected: ${conn.connection.host}`);

      // Handle connection errors after initial connection
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
        if (err.name === 'MongoServerSelectionError') {
          console.error('Could not connect to MongoDB server. Please check if the server is running.');
        }
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected. Attempting to reconnect...');
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
        } else {
          console.error('Max retries reached. Could not connect to MongoDB.');
          process.exit(1);
        }
      });

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected');
        retryCount = 0; // Reset retry count on successful reconnection
      });

      // Handle process termination
      process.on('SIGINT', async () => {
        try {
          await mongoose.connection.close();
          console.log('MongoDB connection closed through app termination');
          process.exit(0);
        } catch (err) {
          console.error('Error during MongoDB disconnection:', err);
          process.exit(1);
        }
      });

    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying connection... (${retryCount}/${maxRetries})`);
        setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
      } else {
        console.error('Max retries reached. Could not connect to MongoDB.');
        process.exit(1);
      }
    }
  };

  await connectWithRetry();
};

module.exports = connectDB; 