import { Router } from 'express';
import { listar, listarTodas, obterPorSlug, criar, atualizar, remover } from '../controllers/postagensController.js';
import { ensureAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', listar);
router.get('/todas', ensureAuth, listarTodas);
router.get('/:slug', obterPorSlug);
router.post('/', ensureAuth, criar);
router.put('/:id', ensureAuth, atualizar);
router.delete('/:id', ensureAuth, remover);

export default router;
