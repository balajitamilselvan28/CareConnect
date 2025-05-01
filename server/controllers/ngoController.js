const NGO = require('../models/NGO');
const { validateNGO } = require('../utils/validators');

// Create a new NGO
exports.createNGO = async (req, res) => {
  try {
    const { error } = validateNGO(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const ngo = new NGO({
      ...req.body,
      createdBy: req.user._id
    });

    await ngo.save();
    res.status(201).json({
      success: true,
      data: ngo
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating NGO',
      error: err.message
    });
  }
};

// Get NGO by ID
exports.getNGOById = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id);
    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'NGO not found'
      });
    }
    res.status(200).json({
      success: true,
      data: ngo
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching NGO',
      error: err.message
    });
  }
};

// Get NGO by user ID
exports.getMyNGO = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const ngo = await NGO.findOne({ createdBy: req.user._id })
      .populate('createdBy', 'name email');

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'No NGO found for this user'
      });
    }

    res.status(200).json({
      success: true,
      data: ngo
    });
  } catch (err) {
    console.error('Error in getMyNGO:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching NGO',
      error: err.message
    });
  }
};

// Update NGO
exports.updateNGO = async (req, res) => {
  try {
    const { error } = validateNGO(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const ngo = await NGO.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'NGO not found or unauthorized'
      });
    }

    res.status(200).json({
      success: true,
      data: ngo
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating NGO',
      error: err.message
    });
  }
};

// Delete NGO
exports.deleteNGO = async (req, res) => {
  try {
    const ngo = await NGO.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'NGO not found or unauthorized'
      });
    }

    res.status(200).json({
      success: true,
      message: 'NGO deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting NGO',
      error: err.message
    });
  }
};

// Get all NGOs
exports.getAllNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      count: ngos.length,
      data: ngos
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching NGOs',
      error: err.message
    });
  }
}; 