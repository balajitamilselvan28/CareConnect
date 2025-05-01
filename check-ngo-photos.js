require('dotenv').config();
const mongoose = require('mongoose');
const NGO = require('./models/NGO');

const checkNGOPhotos = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prongo');
    console.log('Connected to MongoDB');
    
    const ngos = await NGO.find();
    console.log(`Found ${ngos.length} NGOs`);
    
    ngos.forEach((ngo, index) => {
      console.log(`NGO ${index + 1}: ${ngo.name}`);
      console.log(`Photo URL: ${ngo.photo}`);
      console.log('---');
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

checkNGOPhotos();