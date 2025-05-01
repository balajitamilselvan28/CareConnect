const express = require('express');
const router = express.Router();
const {
  getVolunteers,
  getVolunteer,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
  getUserVolunteers
} = require('../controllers/volunteerController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, authorize('admin'), getVolunteers)
  .post(protect, createVolunteer);

// This route must come before the /:id route to avoid conflicts
router.get('/user', protect, getUserVolunteers);

router.route('/:id')
  .get(protect, getVolunteer)
  .put(protect, updateVolunteer)
  .delete(protect, deleteVolunteer);

module.exports = router; 