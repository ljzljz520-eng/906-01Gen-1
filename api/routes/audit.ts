import { Router } from 'express';
import * as auditCtrl from '../controllers/auditController.ts';
import { authMiddleware, roleMiddleware } from '../middleware/auth.ts';

const router = Router();

router.use(authMiddleware);
router.get('/logs', auditCtrl.listLogs);
router.get('/stats', auditCtrl.getStats);
router.post('/logs/export', roleMiddleware('ADMIN'), auditCtrl.exportLogs);

export default router;
