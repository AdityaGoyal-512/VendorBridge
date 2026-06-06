import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';
import { AppError } from '../utils/errorHandler.js';

/**
 * Authentication middleware.
 * Extracts the JWT from the Authorization header (Bearer <token>)
 * or from cookies, verifies it, loads the user, and attaches
 * req.user for downstream handlers.
 */
export async function authenticate(req, _res, next) {
  try {
    // 1. Extract token
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new AppError('Authentication required. Please log in.', 401);
    }

    // 2. Verify token
    const decoded = verifyToken(token);

    // 3. Load user (ensure they still exist and are active)
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new AppError('User belonging to this token no longer exists.', 401);
    }

    if (!user.isActive) {
      throw new AppError('Your account has been deactivated. Contact an administrator.', 403);
    }

    // 4. Attach user to request
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Role-based authorization middleware factory.
 * Pass one or more allowed roles: authorize('admin', 'manager')
 *
 * Must be used AFTER authenticate middleware.
 */
export function authorize(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. Role '${req.user.role}' is not authorized to perform this action. Required: ${allowedRoles.join(', ')}.`,
          403
        )
      );
    }

    next();
  };
}
