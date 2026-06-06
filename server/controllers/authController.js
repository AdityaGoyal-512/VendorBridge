import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt.js';
import { AppError } from '../utils/errorHandler.js';
import config from '../config/index.js';

/**
 * POST /api/v1/auth/register
 * Create a new user account.
 */
export async function register(req, res, next) {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;

    // Check if email already taken
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      throw new AppError('An account with this email already exists', 409);
    }

    // Create user
    const user = await User.create({
      name: `${firstName} ${lastName}`.trim(),
      email: email.toLowerCase(),
      phone,
      password, // Will be hashed by the pre-save hook
      role,
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Log activity
    await ActivityLog.create({
      userId: user._id,
      action: 'User registered',
      module: 'auth',
      targetId: user._id,
      targetModel: 'User',
      metadata: { role, email: user.email },
    });

    // Set cookies
    setTokenCookies(res, accessToken, refreshToken);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: user.toSafeObject(),
        accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/auth/login
 * Authenticate user and return JWT tokens.
 */
export async function login(req, res, next) {
  try {
    const { email, password, rememberMe } = req.body;

    // Find user — explicitly select password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check active status
    if (!user.isActive) {
      throw new AppError('Your account has been deactivated. Contact an administrator.', 403);
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Update user: store refresh token and last login
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Log activity
    await ActivityLog.create({
      userId: user._id,
      action: 'User logged in',
      module: 'auth',
      targetId: user._id,
      targetModel: 'User',
      metadata: { rememberMe: !!rememberMe },
    });

    // Set cookies (longer expiry if rememberMe)
    setTokenCookies(res, accessToken, refreshToken, rememberMe);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toSafeObject(),
        accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/auth/refresh
 * Issue a new access token using a valid refresh token.
 */
export async function refreshAccessToken(req, res, next) {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) {
      throw new AppError('Refresh token is required', 401);
    }

    // Verify refresh token
    const decoded = verifyToken(token);

    // Find user with matching refresh token
    const user = await User.findById(decoded.userId).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      throw new AppError('Invalid refresh token. Please log in again.', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account deactivated.', 403);
    }

    // Issue new access token
    const accessToken = generateAccessToken(user);

    // Optionally rotate refresh token for security
    const newRefreshToken = generateRefreshToken(user);
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    setTokenCookies(res, accessToken, newRefreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed',
      data: { accessToken },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/auth/logout
 * Invalidate refresh token and clear cookies.
 */
export async function logout(req, res, next) {
  try {
    // Clear refresh token from DB if user is authenticated
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

      await ActivityLog.create({
        userId: req.user._id,
        action: 'User logged out',
        module: 'auth',
        targetId: req.user._id,
        targetModel: 'User',
      });
    }

    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/auth/me
 * Return the currently authenticated user's profile.
 */
export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { user: user.toSafeObject() },
    });
  } catch (err) {
    next(err);
  }
}

// ─── Cookie helper ───
function setTokenCookies(res, accessToken, refreshToken, rememberMe = false) {
  const isProduction = process.env.NODE_ENV === 'production';

  const accessMaxAge = 15 * 60 * 1000; // 15 minutes
  const refreshMaxAge = rememberMe
    ? 30 * 24 * 60 * 60 * 1000  // 30 days
    : 7 * 24 * 60 * 60 * 1000;  // 7 days

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
  };

  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: accessMaxAge,
  });

  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: refreshMaxAge,
    path: '/api/v1/auth', // Scoped to auth routes only
  });
}
