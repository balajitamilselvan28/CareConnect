const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
    required: true
  },
  skills: [{
    type: String,
    required: [true, 'Please add at least one skill'],
    trim: true
  }],
  availability: {
    type: String,
    required: [true, 'Please add your availability'],
    trim: true
  },
  interests: [{
    type: String,
    required: [true, 'Please add at least one interest'],
    trim: true
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  hoursCompleted: {
    type: Number,
    default: 0
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for faster queries
VolunteerSchema.index({ user: 1, ngo: 1 });
VolunteerSchema.index({ status: 1 });
VolunteerSchema.index({ createdAt: -1 });

// Prevent duplicate volunteer applications
VolunteerSchema.index({ user: 1, ngo: 1 }, { unique: true });

module.exports = mongoose.model('Volunteer', VolunteerSchema); 