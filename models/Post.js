const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  photo: {
    type: String,
    required: [true, 'Please add a photo URL']
  },
  eventDate: {
    type: Date,
    required: [true, 'Please add event date']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', postSchema); 