import { AuditLog } from "../models/auditLog.js";

export const getAuditLogs = async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const logs = await AuditLog.findAll();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
