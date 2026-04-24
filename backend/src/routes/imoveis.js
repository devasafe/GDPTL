import { Router } from 'express';
import { listar, obterPorSlug, criar, atualizar, remover } from '../controllers/imoveisController.js';
import { ensureAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', listar);
router.get('/:slug', obterPorSlug);
router.post('/', ensureAuth, criar);
router.put('/:id', ensureAuth, atualizar);
router.delete('/:id', ensureAuth, remover);

export default router;
