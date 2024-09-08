import User from '../models/user.js';
import Role from '../models/role.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// Signup function to create an Admin user (one-time setup)
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the "admin" role exists, create if not
    let adminRole = await Role.findOne({ where: { name: 'admin' } });
    if (!adminRole) {
      adminRole = await Role.create({ name: 'admin' }); // Create admin role if it doesn't exist
    }

    // Check if the "user" role exists, create if not
    let userRole = await Role.findOne({ where: { name: 'user' } });
    if (!userRole) {
      userRole = await Role.create({ name: 'user' }); // Create user role if it doesn't exist
    }

    // Check if an admin already exists
    const adminCount = await User.count({ where: { roleId: adminRole.id } });

    let roleId;

    if (adminCount === 0) {
      // No admin exists, assign this user the "admin" role
      roleId = adminRole.id;
    } else {
      // Admin already exists, prevent new admin signup
      return res.status(400).json({
        message: 'Admin already exists. Only one admin is allowed.'
      });
    }

    // Create the new user with the "admin" role
    const newUser = await User.create({
      username,
      email,
      password, // Ensure password is hashed before saving
      roleId,
    });

    res.status(201).json({ message: 'Admin registered successfully', user: newUser });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};


// Login function to authenticate users and issue JWT tokens
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.roleId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Register User function to allow the Admin to create new users
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Validate the role
    const roleInstance = await Role.findOne({ where: { name: role } });
    if (!roleInstance) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      roleId: roleInstance.id
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
