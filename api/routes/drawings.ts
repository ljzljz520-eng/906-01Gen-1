import { Router } from 'express';
import * as drawingCtrl from '../controllers/drawingController.ts';
import { authMiddleware } from '../middleware/auth.ts';

const router = Router();

router.use(authMiddleware);
router.get('/meta', drawingCtrl.meta);
router.get('/', drawingCtrl.searchDrawings);
router.get('/:id', drawingCtrl.getDrawingDetail);
router.get('/:id/versions/:vid/relation', drawingCtrl.getVersionRelation);
router.get('/:id/versions/:vid/download', drawingCtrl.downloadVersion);

export default router;
