const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
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
  amount: {
    type: Number,
    required: [true, 'Please add a donation amount'],
    min: [1, 'Donation amount must be at least 1']
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  paymentDetails: {
    cardNumber: {
      type: String,
      required: [true, 'Please add a card number'],
      match: [/^[0-9]{16}$/, 'Please add a valid 16-digit card number']
    },
    expiryDate: {
      type: String,
      required: [true, 'Please add an expiry date'],
      match: [/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Please add a valid expiry date (MM/YY)']
    },
    cvv: {
      type: String,
      required: [true, 'Please add a CVV'],
      match: [/^[0-9]{3,4}$/, 'Please add a valid CVV']
    }
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for faster queries
DonationSchema.index({ user: 1, ngo: 1 });
DonationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Donation', DonationSchema); 