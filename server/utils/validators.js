const Joi = require('joi');

// NGO validation schema
exports.validateNGO = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(100),
    slogan: Joi.string().required().min(5).max(200),
    description: Joi.string().required().min(20),
    location: Joi.string().required(),
    category: Joi.string().required(),
    photo: Joi.string().uri(),
    website: Joi.string().uri().allow(''),
    email: Joi.string().email().required(),
    phone: Joi.string().required().pattern(/^[0-9+\-\s()]{10,}$/),
    volunteerCount: Joi.number().min(0)
  });

  return schema.validate(data);
};

// User validation schema
exports.validateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    role: Joi.string().valid('user', 'admin').default('user')
  });

  return schema.validate(data);
};

// Login validation schema
exports.validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  return schema.validate(data);
};

// Comment validation schema
exports.validateComment = (data) => {
  const schema = Joi.object({
    content: Joi.string().required().min(1).max(500),
    rating: Joi.number().min(1).max(5).default(5)
  });

  return schema.validate(data);
}; 