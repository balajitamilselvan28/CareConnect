const express = require('express');
const router = express.Router();
const {
  getNGOs,
  getNGO,
  createNGO,
  updateNGO,
  deleteNGO
} = require('../controllers/ngoController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getNGOs)
  .post(protect, authorize('admin'), createNGO);

router.route('/:id')
  .get(getNGO)
  .put(protect, authorize('admin'), updateNGO)
  .delete(protect, authorize('admin'), deleteNGO);

module.exports = router; 