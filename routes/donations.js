const express = require('express');
const router = express.Router();
const {
  getDonations,
  getDonation,
  createDonation,
  updateDonation,
  deleteDonation
} = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, authorize('admin'), getDonations)
  .post(protect, createDonation);

router.route('/:id')
  .get(protect, getDonation)
  .put(protect, updateDonation)
  .delete(protect, deleteDonation);

module.exports = router; 