import User from '../models/user.js';
import Role from '../models/role.js';


// Create a new user (Admin only)
import bcrypt from 'bcrypt'; // Ensure bcrypt is imported

export const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    let userRole;
    if (role) {
      // Check if the provided role exists in the database
      userRole = await Role.findOne({ where: { name: role } });
      if (!userRole) {
        // Optionally, create the role if it doesn't exist
        userRole = await Role.create({ name: role });
      }
    } else {
      // Assign default "user" role if no role is provided
      userRole = await Role.findOne({ where: { name: 'user' } });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword, // Save the hashed password
      roleId: userRole.id
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Server error', error: err });
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
    // Remove any leading/trailing whitespace or newline characters from the UUID
    const userId = req.params.id.trim();

    // Fetch user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with user details (excluding password for security reasons)
    const { password, ...userDetails } = user.dataValues;
    res.status(200).json(userDetails);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update user by ID (Admin only)
export const updateUserById = async (req, res) => {
  try {
    const userId = req.params.id.trim();
    const { username, email, password } = req.body;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare the updated data
    const updatedData = {
      username: username || user.username,
      email: email || user.email,
      password: password ? await bcrypt.hash(password, 10) : user.password,
    };

    // Update the user
    await user.update(updatedData);

    // Respond with updated user details
    res.status(200).json({ message: 'User updated successfully', user: user });
  } catch (error) {
    console.error('Error updating user by ID:', error);
    res.status(500).json({ message: 'Server error', error });
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