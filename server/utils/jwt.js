import jwt from 'jsonwebtoken';
import config from '../config/index.js';

/**
 * Generate an access token (short-lived).
 * Payload includes userId, email, and role for downstream authorization.
 */
export function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.accessExpiresIn }
  );
}

/**
 * Generate a refresh token (long-lived).
 * Contains only the userId — role/email are fetched fresh on refresh.
 */
export function generateRefreshToken(user) {
  return jwt.sign(
    { userId: user._id },
    config.jwt.secret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );
}

/**
 * Verify and decode a JWT token.
 * Returns the decoded payload or throws on invalid/expired tokens.
 */
export function verifyToken(token) {
  return jwt.verify(token, config.jwt.secret);
}
