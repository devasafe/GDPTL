import api from './api'

/**
 * Fazer upload de uma única imagem
 * @param {File} file - Arquivo a ser enviado
 * @returns {Promise} - Resposta do servidor com URL da imagem
 */
export const uploadImage = async (file) => {
  console.log('uploadService.uploadImage chamado', file.name)
  const formData = new FormData()
  formData.append('file', file)
  
  console.log('FormData pronto, enviando para /upload/image')
  try {
    // Não precisa especificar Content-Type: 'multipart/form-data'
    // axios faz isso automaticamente quando detecta FormData
    const response = await api.post('/upload/image', formData)
    console.log('uploadImage resposta:', response)
    return response
  } catch (error) {
    console.error('uploadImage erro:', error.response?.status, error.response?.data || error.message)
    throw error
  }
}

/**
 * Fazer upload de múltiplas imagens/vídeos
 * @param {FileList} files - Lista de arquivos a serem enviados
 * @returns {Promise} - Resposta do servidor com URLs dos arquivos
 */
export const uploadMultiple = async (files) => {
  console.log('uploadService.uploadMultiple chamado com', files.length, 'arquivos')
  const formData = new FormData()
  
  for (let i = 0; i < files.length; i++) {
    console.log('Adicionando arquivo:', files[i].name)
    formData.append('files', files[i])
  }

  console.log('FormData pronto com', files.length, 'arquivo(s), enviando para /upload/multiple')
  try {
    // Não precisa especificar Content-Type: 'multipart/form-data'
    // axios faz isso automaticamente quando detecta FormData
    const response = await api.post('/upload/multiple', formData)
    console.log('uploadMultiple resposta:', response)
    return response
  } catch (error) {
    console.error('uploadMultiple erro:', error.response?.status, error.response?.data || error.message)
    throw error
  }
}

/**
 * Deletar um arquivo pela sua chave pública (publicId)
 * @param {string} publicId - ID público do arquivo na Cloudinary
 * @returns {Promise} - Resposta do servidor
 */
export const deleteFile = async (publicId) => {
  return api.delete(`/upload/${publicId}`, {
    data: { publicId },
  })
}

export default {
  uploadImage,
  uploadMultiple,
  deleteFile,
}
