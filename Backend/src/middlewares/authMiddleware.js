import jwt from 'jsonwebtoken';
import Role from '../models/role.js'; // Import the Role model
import User from '../models/user.js'; // Import the User model
export const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Failed to authenticate token' });
    req.user = decoded;
    next();
  });
};

export const adminMiddleware = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming you get the user ID from the request (JWT)

    // Fetch the UUID for the 'admin' role from the Roles table
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    
    if (!adminRole) {
      return res.status(403).json({ message: 'Admin role not found' });
    }

    // Fetch the user by ID
    const user = await User.findByPk(userId);

    // Check if the user's roleId matches the admin role's UUID
    if (user.roleId !== adminRole.id) {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    // If the user has the admin role, proceed to the next middleware or route
    next();
  } catch (err) {
    console.error('Error in adminMiddleware:', err);
    return res.status(500).json({ message: 'Server error', error: err });
  }
};

export const managerMiddleware = (req, res, next) => {
  if (req.user.role !== 'Admin' && req.user.role !== 'Manager') return res.status(403).json({ message: 'Access denied' });
  next();
};
