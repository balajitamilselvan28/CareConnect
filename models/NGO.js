const mongoose = require('mongoose');

const NGOSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  slogan: {
    type: String,
    required: [true, 'Please add a slogan'],
    maxlength: [100, 'Slogan cannot be more than 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Education',
      'Health',
      'Environment',
      'Animal Welfare',
      'Human Rights',
      'Disaster Relief',
      'Community Development',
      'Other'
    ]
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  yearEstablished: {
    type: Number,
    required: [true, 'Please add the year established']
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  photo: {
    type: String,
    default: 'no-photo.jpg'
  },
  donationCount: {
    type: Number,
    default: 0
  },
  volunteerCount: {
    type: Number,
    default: 0
  },
  totalDonations: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for faster queries
NGOSchema.index({ name: 1 });
NGOSchema.index({ category: 1 });
NGOSchema.index({ location: 1 });
NGOSchema.index({ createdAt: -1 });

module.exports = mongoose.model('NGO', NGOSchema); 