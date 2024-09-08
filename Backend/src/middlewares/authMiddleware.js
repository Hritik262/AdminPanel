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
    const token = req.headers.authorization?.split(' ')[1]; // Assumes 'Bearer token'
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Debugging

    // Fetch the user based on the decoded token
    const user = await User.findByPk(decoded.userId);
    console.log('Fetched User:', user); // Debugging

    // If the user does not exist, deny access
    if (!user) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Fetch the admin role ID
    const adminRole = await Role.findOne({ where: { name: 'admin' } });

    // If the role does not match 'admin', deny access
    if (user.roleId !== adminRole.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // If the user is admin, proceed to the next middleware/route
    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    console.error('Error in adminMiddleware:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// export const managerMiddleware = async(req, res, next) => {
//   try {
//     const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
//     console.log('Decoded Token:', decoded);

//     const user = await User.findByPk(decoded.userId);
//     console.log('Fetched User:', user);

//     if (!user) {
//       return res.status(401).json({ message: 'Access denied' });
//     }

//     const userRole = await Role.findByPk(user.roleId);
//     console.log('Fetched User Role:', userRole);

//     // Check if the user is an admin or manager
//     if (userRole.name === 'admin' || userRole.name === 'manager') {
//       next(); // Grant access
//     } else {
//       return res.status(403).json({ message: 'Access denied' });
//     }
//   } catch (error) {
//     console.error('Error in adminManagerMiddleware:', error);
//     return res.status(500).json({ message: 'Server error', error });
//   }
// };
export const adminManagerMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract token from Authorization header
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);

    const user = await User.findByPk(decoded.userId);
    console.log('Fetched User:', user);

    if (!user) {
      return res.status(401).json({ message: 'Access denied' });
    }

    const userRole = await Role.findByPk(user.roleId);
    console.log('Fetched User Role:', userRole);

    if (userRole.name === 'admin' || userRole.name === 'manager') {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
  } catch (error) {
    console.error('Error in adminManagerMiddleware:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};


