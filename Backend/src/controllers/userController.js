import User from "../models/user.js";
import Role from "../models/role.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";

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
      userRole = await Role.findOne({ where: { name: "user" } });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      roleId: userRole.id,
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Get all users (Admin and Manager)
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get users",
      error: error.message,
    });
  }
};

// Get user by ID (accessible by all users)
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id.trim();

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with user details
    const { password, ...userDetails } = user.dataValues;
    res.status(200).json(userDetails);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update user by ID (Admin only)
export const updateUserById = async (req, res) => {
  try {
    const userId = req.params.id.trim();
    const { username, email, password } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
    res.status(200).json({
      message: "User updated successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error,
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
        message: "User not found",
      });
    }
    // Soft delete the user
    await user.update({ deletedAt: new Date() });
    res.status(200).json({
      success: true,
      message: "User soft deleted successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User deletion failed",
      error: error.message,
    });
  }
};

// Permanently delete user (Admin only)
export const permanentDeleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user that is soft-deleted
    const user = await User.findOne({
      where: { id: userId, deletedAt: { [Op.not]: null } },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found or not deleted" });
    }

    // Permanently delete the user
    await user.destroy({ force: true });

    res.status(200).json({
      success: true,
      message: "User permanently deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};

// Restore user (Admin only)
export const restoreUser = async (req, res) => {
  try {
    const userId = req.params.id.trim();

    // restore the user
    const result = await User.restore({
      where: { id: userId, deletedAt: { [Op.ne]: null } },
    });

    if (result[0] === 0) {
      // Check if any rows were affected
      return res.status(404).json({
        success: false,
        message: "User not found or not deleted",
      });
    }

    res.status(200).json({
      success: true,
      message: "User restored successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};

// Assign role to user (Admin only)
export const assignRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { roleId } = req.body;
    // Find the user
    const user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Find the role
    const role = await Role.findByPk(roleId);
    if (!role) {
      return res
        .status(404)
        .json({ success: false, message: "Role not found" });
    }

    // Assign the role to the user
    user.roleId = roleId;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Role assigned successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Revoke role from user (Admin only)
export const revokeRole = async (req, res) => {
  try {
    const userId = req.params.id.trim();

    const user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await user.update({ roleId: null });

    res
      .status(200)
      .json({ success: true, message: "Role revoked successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
