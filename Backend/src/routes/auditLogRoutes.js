import express from 'express';
import { getAuditLogs } from '../controllers/auditLogController.js';
import { adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', adminMiddleware, getAuditLogs);

export default router;
