import { AuditLog } from "../models/auditLog.js";

export const logAudit = async (action, performedBy, targetResource) => {
  try {
    await AuditLog.create({
      action,
      performedBy,
      performedAt: new Date(),
      targetResource,
    });
  } catch (err) {
    console.error("Failed to log audit action:", err);
  }
};
