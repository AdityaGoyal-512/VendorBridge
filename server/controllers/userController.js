import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import { AppError } from '../utils/errorHandler.js';

/**
 * GET /api/v1/users
 * List all users. Admin only.
 */
export async function getAllUsers(req, res, next) {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      isActive,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('vendorId', 'name'),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: users.map((u) => u.toSafeObject()),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/users/:id
 * Get a single user by ID. Admin + self.
 */
export async function getUserById(req, res, next) {
  try {
    const user = await User.findById(req.params.id).populate('vendorId', 'name');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Non-admins can only view their own profile
    if (req.user.role !== 'admin' && req.user._id.toString() !== user._id.toString()) {
      throw new AppError('Access denied', 403);
    }

    res.status(200).json({
      success: true,
      data: { user: user.toSafeObject() },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/v1/users/:id
 * Update a user. Admin can update anyone; users can update own non-role fields.
 */
export async function updateUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isAdmin = req.user.role === 'admin';
    const isSelf = req.user._id.toString() === user._id.toString();

    if (!isAdmin && !isSelf) {
      throw new AppError('Access denied', 403);
    }

    // Fields allowed for self-update
    const selfAllowed = ['name', 'phone'];
    // Fields only admins can update
    const adminAllowed = ['name', 'phone', 'role', 'isActive', 'vendorId'];
    const allowedFields = isAdmin ? adminAllowed : selfAllowed;

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    await ActivityLog.create({
      userId: req.user._id,
      action: `Updated user ${user.name}`,
      module: 'auth',
      targetId: user._id,
      targetModel: 'User',
      metadata: { updatedFields: Object.keys(updates) },
    });

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser.toSafeObject() },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/v1/users/:id
 * Soft-delete a user (set isActive: false). Admin only.
 */
export async function deleteUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Prevent admin from deactivating themselves
    if (req.user._id.toString() === user._id.toString()) {
      throw new AppError('You cannot deactivate your own account', 400);
    }

    user.isActive = false;
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });

    await ActivityLog.create({
      userId: req.user._id,
      action: `Deactivated user ${user.name}`,
      module: 'auth',
      targetId: user._id,
      targetModel: 'User',
      metadata: { deactivatedEmail: user.email },
    });

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
    });
  } catch (err) {
    next(err);
  }
}
