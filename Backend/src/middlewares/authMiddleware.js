import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Failed to authenticate token' });
    req.user = decoded;
    next();
  });
};

export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Access denied' });
  next();
};

export const managerMiddleware = (req, res, next) => {
  if (req.user.role !== 'Admin' && req.user.role !== 'Manager') return res.status(403).json({ message: 'Access denied' });
  next();
};
