const mongoose = require('mongoose');

const SportsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a sport name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Team Sports',
      'Individual Sports',
      'Water Sports',
      'Combat Sports',
      'Athletics',
      'Racket Sports',
      'Winter Sports',
      'Extreme Sports',
      'Mind Sports',
      'Other'
    ]
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  equipment: {
    type: [String],
    default: []
  },
  popularity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  indoor: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for faster queries
SportsSchema.index({ name: 1 });
SportsSchema.index({ category: 1 });
SportsSchema.index({ popularity: 1 });
SportsSchema.index({ indoor: 1 });

module.exports = mongoose.model('Sports', SportsSchema);