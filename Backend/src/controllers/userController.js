import User from '../models/user.js';
import Role from '../models/role.js';

// Create a new user
// Create a new user (Admin only)
export const createUser = async (req, res) => {
  try {
    const { username, password, email, roleId } = req.body;
    const user = await User.create({ username, password, email, roleId });
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'User creation failed',
      error: error.message,
    });
  }
};

// Get all users (Admin and Manager)
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error.message,
    });
  }
};

// Get user by ID (accessible by all users)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user',
      error: error.message,
    });
  }
};

// Update user by ID (Admin only)
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    const { username, email, roleId } = req.body;
    user.username = username || user.username;
    user.email = email || user.email;
    user.roleId = roleId || user.roleId;
    await user.save();
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'User update failed',
      error: error.message,
    });
  }
};

// Soft delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    await user.update({ deletedAt: new Date() }); // Soft delete
    res.status(200).json({
      success: true,
      message: 'User soft deleted successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'User deletion failed',
      error: error.message,
    });
  }
};

// Permanently delete user (Admin only)
export const permanentDeleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { paranoid: false });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    await user.destroy({ force: true }); // Permanently delete
    res.status(200).json({
      success: true,
      message: 'User permanently deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to permanently delete user',
      error: error.message,
    });
  }
};

// Restore user (Admin only)
export const restoreUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { paranoid: false });
    if (!user || !user.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'User not found or not deleted',
      });
    }
    await user.restore();
    res.status(200).json({
      success: true,
      message: 'User restored successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'User restore failed',
      error: error.message,
    });
  }
};

// Assign role to user (Admin only)
export const assignRole = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    const role = await Role.findByPk(req.body.roleId);
    if (!user || !role) {
      return res.status(404).json({
        success: false,
        message: 'User or role not found',
      });
    }
    user.roleId = role.id;
    await user.save();
    res.status(200).json({
      success: true,
      message: 'Role assigned successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Role assignment failed',
      error: error.message,
    });
  }
};

// Revoke role from user (Admin only)
export const revokeRole = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    user.roleId = null; // Remove role
    await user.save();
    res.status(200).json({
      success: true,
      message: 'Role revoked successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Role revocation failed',
      error: error.message,
    });
  }
};