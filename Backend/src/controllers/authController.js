import User from '../models/user.js';
import Role from '../models/role.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Signup function to create an Admin user (one-time setup)
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if an admin already exists
    const adminCount = await User.count({ where: { roleId: 'admin' } });
    if (adminCount > 0) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const role = await Role.findOne({ where: { name: 'Admin' } });
    if (!role) {
      return res.status(500).json({ message: 'Admin role not found' });
    }

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      roleId: role.id
    });

    res.status(201).json({ message: 'Admin created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
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
