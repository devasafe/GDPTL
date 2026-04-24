import { Router } from 'express';
import { gerarFeedXML } from '../controllers/canalProController.js';

const router = Router();

router.get('/feed', gerarFeedXML);

export default router;
