import { Router } from 'express';
import * as authCtrl from '../controllers/authController.ts';
import { authMiddleware } from '../middleware/auth.ts';

const router = Router();

router.post('/login', authCtrl.login);
router.get('/me', authMiddleware, authCtrl.me);

export default router;
