import express from 'express';
import { upload } from '../services/cloudinary.js';
import { uploadImage, uploadMultiple, deleteFile } from '../controllers/uploadController.js';
import { ensureAuth } from '../middleware/auth.js';

const router = express.Router();

// Upload de uma única imagem (com Cloudinary)
router.post('/image', ensureAuth, (req, res, next) => {
  console.log('=== ROUTE /upload/image ===')
  console.log('User:', req.user)
  // Se não tiver credenciais, usar fallback
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error('Cloudinary não configurado')
    return res.status(400).json({ 
      error: 'Credenciais Cloudinary não configuradas. Configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET no backend/.env' 
    });
  }
  console.log('Cloudinary OK, processando upload...')
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err)
      return res.status(400).json({ error: 'Erro ao processar arquivo: ' + err.message })
    }
    console.log('Multer OK, arquivo recebido:', !!req.file)
    next()
  });
}, uploadImage);

// Upload de múltiplas imagens/vídeos (com Cloudinary)
router.post('/multiple', ensureAuth, (req, res, next) => {
  // Se não tiver credenciais, usar fallback
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return res.status(400).json({ 
      error: 'Credenciais Cloudinary não configuradas. Configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_SECRET no backend/.env' 
    });
  }
  upload.array('files', 10)(req, res, next);
}, uploadMultiple);

// Deletar arquivo pelo public_id
router.delete('/:publicId', ensureAuth, deleteFile);

export default router;
