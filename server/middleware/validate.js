import { body, validationResult } from 'express-validator';
import { AppError } from '../utils/errorHandler.js';

/**
 * Validation middleware: runs express-validator checks then
 * returns 400 with structured errors if any fail.
 */
export function validate(req, _res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    return next(new AppError('Validation failed', 400, formatted));
  }
  next();
}

// ─── Reusable validation chains ───

export const registerValidation = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be 2–50 characters'),
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be 2–50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^\+?[\d\s\-()]{7,15}$/).withMessage('Please provide a valid phone number'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
  body('confirmPassword')
    .notEmpty().withMessage('Please confirm your password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  body('role')
    .trim()
    .notEmpty().withMessage('Role is required')
    .isIn(['admin', 'procurement_officer', 'vendor', 'manager'])
    .withMessage('Invalid role selection'),
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

export const vendorValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Vendor name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Vendor name must be 2–100 characters'),
  body('gstNumber')
    .trim()
    .notEmpty().withMessage('GST number is required')
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).withMessage('Invalid GST format (expected e.g., 27AAAAA1111A1Z1)'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^\+?[\d\s\-()]{10,15}$/).withMessage('Please provide a valid phone number (min 10 digits)'),
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required'),
];

export const rfqValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('RFQ title is required'),
  body('productName')
    .trim()
    .notEmpty().withMessage('Product name is required'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('deadline')
    .notEmpty().withMessage('Deadline is required')
    .isISO8601().withMessage('Invalid deadline date format'),
];

