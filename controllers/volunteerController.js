const Volunteer = require('../models/Volunteer');
const NGO = require('../models/NGO');

// @desc    Get all volunteers
// @route   GET /api/volunteers
// @access  Private/Admin
exports.getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find()
      .populate('user', 'name email')
      .populate('ngo', 'name')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: volunteers.length,
      data: volunteers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single volunteer
// @route   GET /api/volunteers/:id
// @access  Private
exports.getVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id)
      .populate('user', 'name email')
      .populate('ngo', 'name');

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        error: 'Volunteer not found'
      });
    }

    // Make sure user is volunteer owner or admin
    if (
      volunteer.user._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this volunteer'
      });
    }

    res.status(200).json({
      success: true,
      data: volunteer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new volunteer
// @route   POST /api/volunteers
// @access  Private
exports.createVolunteer = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Validate NGO exists
    const ngo = await NGO.findById(req.body.ngo);
    if (!ngo) {
      return res.status(404).json({
        success: false,
        error: 'NGO not found'
      });
    }

    // Check if user already applied
    const existingVolunteer = await Volunteer.findOne({
      user: req.user.id,
      ngo: req.body.ngo
    });

    if (existingVolunteer) {
      return res.status(400).json({
        success: false,
        error: 'You have already applied to volunteer for this NGO'
      });
    }

    const volunteer = await Volunteer.create(req.body);

    // Update NGO volunteer count
    await NGO.findByIdAndUpdate(req.body.ngo, {
      $inc: { volunteerCount: 1 }
    });

    res.status(201).json({
      success: true,
      data: volunteer
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update volunteer
// @route   PUT /api/volunteers/:id
// @access  Private
exports.updateVolunteer = async (req, res) => {
  try {
    let volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        error: 'Volunteer not found'
      });
    }

    // Make sure user is volunteer owner or admin
    if (
      volunteer.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this volunteer'
      });
    }

    volunteer = await Volunteer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: volunteer
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete volunteer
// @route   DELETE /api/volunteers/:id
// @access  Private
exports.deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        error: 'Volunteer not found'
      });
    }

    // Make sure user is volunteer owner or admin
    if (
      volunteer.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this volunteer'
      });
    }

    // Update NGO volunteer count
    await NGO.findByIdAndUpdate(volunteer.ngo, {
      $inc: { volunteerCount: -1 }
    });

    await volunteer.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get user's volunteers
// @route   GET /api/volunteers/user
// @access  Private
exports.getUserVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find({ user: req.user.id })
      .populate('ngo', 'name photo')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: volunteers.length,
      data: volunteers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 