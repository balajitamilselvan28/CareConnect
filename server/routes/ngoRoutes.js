const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createNGO,
  getNGOById,
  getMyNGO,
  updateNGO,
  deleteNGO,
  getAllNGOs
} = require('../controllers/ngoController');

// Public routes
router.get('/', getAllNGOs);

// Protected routes
router.use(protect);
router.get('/my-ngo', getMyNGO);
router.post('/', createNGO);
router.get('/:id', getNGOById);
router.put('/:id', updateNGO);
router.delete('/:id', deleteNGO);

module.exports = router; 