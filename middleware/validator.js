const { body, param, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// User validation
const userValidation = {
  register: [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    validate
  ],
  login: [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
  ]
};

// Post validation
const postValidation = {
  create: [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('photo').trim().notEmpty().withMessage('Photo URL is required'),
    body('eventDate').isISO8601().withMessage('Valid event date is required'),
    validate
  ],
  update: [
    param('id').isMongoId().withMessage('Invalid post ID'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('photo').optional().trim().notEmpty().withMessage('Photo URL cannot be empty'),
    body('eventDate').optional().isISO8601().withMessage('Valid event date is required'),
    validate
  ]
};

// Comment validation
const commentValidation = {
  create: [
    param('postId').isMongoId().withMessage('Invalid post ID'),
    body('text')
      .trim()
      .notEmpty()
      .withMessage('Comment text is required')
      .isLength({ max: 500 })
      .withMessage('Comment cannot be more than 500 characters'),
    validate
  ],
  update: [
    param('id').isMongoId().withMessage('Invalid comment ID'),
    body('text')
      .trim()
      .notEmpty()
      .withMessage('Comment text is required')
      .isLength({ max: 500 })
      .withMessage('Comment cannot be more than 500 characters'),
    validate
  ]
};

// NGO validation
const ngoValidation = {
  create: [
    body('name').trim().notEmpty().withMessage('NGO name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('photo').trim().notEmpty().withMessage('Photo URL is required'),
    validate
  ],
  update: [
    param('id').isMongoId().withMessage('Invalid NGO ID'),
    body('name').optional().trim().notEmpty().withMessage('NGO name cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
    body('photo').optional().trim().notEmpty().withMessage('Photo URL cannot be empty'),
    validate
  ]
};

// Donation validation
const donationValidation = {
  create: [
    body('amount').isNumeric().withMessage('Valid amount is required'),
    body('ngo').isMongoId().withMessage('Valid NGO ID is required'),
    validate
  ]
};

// Volunteer validation
const volunteerValidation = {
  create: [
    body('ngo').isMongoId().withMessage('Valid NGO ID is required'),
    body('skills').isArray().withMessage('Skills must be an array'),
    body('availability').trim().notEmpty().withMessage('Availability is required'),
    body('interests').isArray().withMessage('Interests must be an array'),
    validate
  ]
};

module.exports = {
  userValidation,
  postValidation,
  commentValidation,
  ngoValidation,
  donationValidation,
  volunteerValidation
}; 