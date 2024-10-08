import jwt from "jsonwebtoken";
import Role from "../models/role.js"; 
import User from "../models/user.js";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = decoded; // Attach decoded token to request
    next();
  });
};

export const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Fetch the admin role ID
    const adminRole = await Role.findOne({ where: { name: "admin" } });

    // If the role does not match 'admin', deny access
    if (user.roleId !== adminRole.id) {
      return res
        .status(403)
        .json({ message: "Access denied by admin middleware" });
    }

    // If the user is admin, proceed to the next middleware/route
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const adminManagerMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Access denied" });
    }

    const userRole = await Role.findByPk(user.roleId);;

    if (userRole.name === "admin" || userRole.name === "manager") {
      next();
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
