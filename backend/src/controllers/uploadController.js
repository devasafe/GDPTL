import cloudinary from '../services/cloudinary.js';

export const uploadImage = async (req, res) => {
  try {
    console.log('=== UPLOAD IMAGE START ===')
    console.log('req.file exists:', !!req.file)
    console.log('req.files exists:', !!req.files)
    
    if (!req.file) {
      console.log('ERROR: Nenhum arquivo foi enviado')
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    console.log('req.file keys:', Object.keys(req.file))
    console.log('req.file:', JSON.stringify(req.file, null, 2));

    // Com multer-storage-cloudinary, os dados vêm em req.file
    const url = req.file.path; // URL completa do Cloudinary
    const publicId = req.file.filename; // public_id gerado pelo Cloudinary
    const resourceType = req.file.resource_type || 'image';

    console.log('Upload success:', { url, publicId, resourceType })
    console.log('=== UPLOAD IMAGE END ===')

    return res.status(200).json({
      success: true,
      url: url,
      publicId: publicId,
      type: resourceType,
      message: 'Imagem enviada com sucesso',
    });
  } catch (err) {
    console.error('=== UPLOAD ERROR ===')
    console.error('Erro ao fazer upload:', err);
    console.error('Error message:', err.message)
    console.error('Error stack:', err.stack)
    res.status(500).json({ error: 'Erro ao fazer upload da imagem', details: err.message });
  }
};

export const uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    const uploads = req.files.map((file) => ({
      url: file.path, // URL completa do Cloudinary
      publicId: file.filename, // public_id gerado pelo Cloudinary
      type: file.resource_type || 'image',
    }));

    return res.status(200).json({
      success: true,
      files: uploads,
      message: `${uploads.length} arquivo(s) enviado(s) com sucesso`,
    });
  } catch (err) {
    console.error('Erro ao fazer upload múltiplo:', err);
    res.status(500).json({ error: 'Erro ao fazer upload dos arquivos' });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ error: 'Public ID é obrigatório' });
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      return res.status(200).json({
        success: true,
        message: 'Arquivo deletado com sucesso',
      });
    } else {
      return res.status(400).json({
        error: 'Erro ao deletar arquivo',
      });
    }
  } catch (err) {
    console.error('Erro ao deletar arquivo:', err);
    res.status(500).json({ error: 'Erro ao deletar arquivo' });
  }
};
