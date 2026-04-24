import { Router } from 'express';
import { exportar } from '../controllers/portalController.js';
import { ensureAuth } from '../middleware/auth.js';

const router = Router();

router.get('/export', ensureAuth, exportar);

export default router;
