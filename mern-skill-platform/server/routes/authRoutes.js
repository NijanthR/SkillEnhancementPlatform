const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const fieldErrors = {};
    errors.array().forEach(err => {
      if (err.path && !fieldErrors[err.path]) {
        fieldErrors[err.path] = err.msg;
      }
    });
    const message = errors.array().map(e => e.msg).join('. ');
    return res.status(400).json({ message, errors: errors.array(), fieldErrors });
  }
  next();
};

router.post('/register',
  [
    body('name').trim().notEmpty().withMessage('Full Name is required'),
    body('email').trim().isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').isIn(['student', 'faculty']).withMessage('Role must be either student or faculty')
  ],
  validate, register
);

router.post('/login',
  [
    body('email').trim().isEmail().withMessage('Please enter a valid email address'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate, login
);

router.get('/me', protect, getMe);

module.exports = router;
