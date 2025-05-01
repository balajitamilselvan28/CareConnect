const NGO = require('../models/NGO');

// @desc    Get all NGOs
// @route   GET /api/ngos
// @access  Public
exports.getNGOs = async (req, res) => {
  try {
    console.log('GET /api/ngos request received');
    const { category, search } = req.query;
    let query = {};

    // Filter by category
    if (category) {
      query.category = category;
      console.log('Filtering by category:', category);
    }

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
      console.log('Searching by name:', search);
    }

    console.log('Query:', query);
    const ngos = await NGO.find(query);
    console.log(`Found ${ngos.length} NGOs`);
    
    res.status(200).json({
      success: true,
      count: ngos.length,
      data: ngos
    });
  } catch (error) {
    console.error('Error in getNGOs:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single NGO
// @route   GET /api/ngos/:id
// @access  Public
exports.getNGO = async (req, res) => {
  try {
    console.log(`GET /api/ngos/${req.params.id} request received`);
    
    // Validate NGO ID format
    if (!req.params.id) {
      console.error('Missing NGO ID');
      return res.status(400).json({
        success: false,
        error: 'Missing NGO ID'
      });
    }
    
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.error('Invalid NGO ID format:', req.params.id);
      return res.status(400).json({
        success: false,
        error: 'Invalid NGO ID format'
      });
    }
    
    console.log(`Looking for NGO with ID: ${req.params.id}`);
    const ngo = await NGO.findById(req.params.id);
    
    if (!ngo) {
      console.log(`NGO with ID ${req.params.id} not found`);
      return res.status(404).json({
        success: false,
        error: 'NGO not found'
      });
    }
    
    console.log(`Found NGO: ${ngo.name}`);
    res.status(200).json({
      success: true,
      data: ngo
    });
  } catch (error) {
    console.error('Error in getNGO:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
    });
  }
};

// @desc    Create new NGO
// @route   POST /api/ngos
// @access  Private/Admin
exports.createNGO = async (req, res) => {
  try {
    const ngo = await NGO.create(req.body);
    res.status(201).json({
      success: true,
      data: ngo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update NGO
// @route   PUT /api/ngos/:id
// @access  Private/Admin
exports.updateNGO = async (req, res) => {
  try {
    const ngo = await NGO.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!ngo) {
      return res.status(404).json({
        success: false,
        error: 'NGO not found'
      });
    }
    res.status(200).json({
      success: true,
      data: ngo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete NGO
// @route   DELETE /api/ngos/:id
// @access  Private/Admin
exports.deleteNGO = async (req, res) => {
  try {
    const ngo = await NGO.findByIdAndDelete(req.params.id);
    if (!ngo) {
      return res.status(404).json({
        success: false,
        error: 'NGO not found'
      });
    }
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 