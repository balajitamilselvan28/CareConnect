const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string:', process.env.MONGODB_URI || 'mongodb://localhost:27017/prongo');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prongo');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Check if NGO collection exists and has documents
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    if (collections.some(c => c.name === 'ngos')) {
      const ngoCount = await mongoose.connection.db.collection('ngos').countDocuments();
      console.log(`NGO collection exists with ${ngoCount} documents`);
      
      if (ngoCount > 0) {
        const sampleNGO = await mongoose.connection.db.collection('ngos').findOne();
        console.log('Sample NGO document:', sampleNGO);
      }
    } else {
      console.log('NGO collection does not exist');
    }
    
    mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error('Full error:', error);
  }
};

testConnection();