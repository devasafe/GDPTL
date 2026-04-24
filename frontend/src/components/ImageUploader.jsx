import React, { useState } from 'react'
import { uploadImage, uploadMultiple } from '../services/uploadService'

const PRIMARY_COLOR = '#001d44'
const SECONDARY_COLOR = '#c41e3a'
const ACCENT_COLOR = '#ffffff'
const TEXT_LIGHT = '#666666'

const ImageUploader = ({ 
  onUploadSuccess, 
  onUploadError, 
  multiple = false, 
  accept = 'image/*,video/*',
  maxSize = 10 * 1024 * 1024, // 10MB por padrão
}) => {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const validateFiles = (files) => {
    const fileArray = Array.from(files)
    
    for (let file of fileArray) {
      if (file.size > maxSize) {
        onUploadError(`Arquivo "${file.name}" excede o tamanho máximo de ${maxSize / 1024 / 1024}MB`)
        return false
      }
    }
    
    return true
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (!validateFiles(e.dataTransfer.files)) return

    const files = multiple ? e.dataTransfer.files : [e.dataTransfer.files[0]]
    await handleUpload(files)
  }

  const handleChange = async (e) => {
    console.log('handleChange chamado, files:', e.target.files.length)
    if (!validateFiles(e.target.files)) return

    const files = multiple ? e.target.files : [e.target.files[0]]
    console.log('Iniciando upload de', files.length, 'arquivo(s)')
    await handleUpload(files)
  }

  const handleUpload = async (files) => {
    try {
      console.log('=== UPLOAD START ===')
      console.log('Files:', files)
      console.log('Multiple:', multiple)
      console.log('Files length:', files.length)
      
      setUploading(true)
      setUploadProgress(0)

      let response

      if (multiple && files.length > 1) {
        console.log('Usando uploadMultiple')
        response = await uploadMultiple(files)
      } else {
        console.log('Usando uploadImage')
        response = await uploadImage(files[0])
      }

      console.log('Response:', response)

      setUploadProgress(100)

      if (response.data.success) {
        // Se o backend retornar um array de arquivos (uploadMultiple), usar diretamente
        // Se retornar um único arquivo (uploadImage), encapsular em array
        let uploadedFiles
        if (Array.isArray(response.data.files)) {
          uploadedFiles = response.data.files
          console.log('Backend retornou array de arquivos:', uploadedFiles)
        } else {
          uploadedFiles = [{ url: response.data.url, publicId: response.data.publicId }]
          console.log('Backend retornou arquivo único, encapsulando:', uploadedFiles)
        }
        console.log('Upload bem-sucedido! Chamando onUploadSuccess com:', uploadedFiles)
        onUploadSuccess(uploadedFiles)
        setUploadProgress(0)
      } else {
        const errorMsg = response.data.error || 'Erro ao fazer upload'
        console.error('Upload error:', errorMsg)
        // Se for erro de credenciais, mostrar mensagem clara
        if (errorMsg.includes('Cloudinary')) {
          onUploadError('⚠️ Configure as credenciais do Cloudinary no backend/.env para usar upload. Leia docs/UPLOAD_CLOUDINARY.md')
        } else {
          onUploadError(errorMsg)
        }
      }
    } catch (error) {
      console.error('Upload exception:', error)
      const errorMsg = error.response?.data?.error || error.message || 'Erro ao fazer upload'
      // Se for erro de credenciais, mostrar mensagem clara
      if (errorMsg.includes('Cloudinary') || errorMsg.includes('credenciais')) {
        onUploadError('⚠️ Configure as credenciais do Cloudinary no backend/.env para usar upload. Leia docs/UPLOAD_CLOUDINARY.md')
      } else if (errorMsg.includes('401') || errorMsg.includes('Token')) {
        onUploadError('❌ Sessão expirada. Faça login novamente.')
      } else {
        onUploadError(errorMsg)
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${dragActive ? SECONDARY_COLOR : PRIMARY_COLOR}`,
        borderRadius: '8px',
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: dragActive ? 'rgba(196, 30, 58, 0.05)' : 'rgba(0, 29, 68, 0.02)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        disabled={uploading}
        style={{
          display: 'none',
        }}
        id="file-upload"
      />
      
      <label
        htmlFor="file-upload"
        style={{
          cursor: uploading ? 'not-allowed' : 'pointer',
          display: 'block',
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '2rem' }}>📁</span>
        </div>
        
        <h3 style={{ margin: '0 0 0.5rem', color: PRIMARY_COLOR, fontWeight: 700 }}>
          {uploading ? 'Enviando...' : 'Arraste arquivos aqui ou clique'}
        </h3>
        
        <p style={{ margin: '0 0 0.5rem', color: TEXT_LIGHT, fontSize: '0.95rem' }}>
          {multiple ? 'Você pode enviar múltiplas imagens ou vídeos' : 'Selecione uma imagem ou vídeo'}
        </p>
        
        <p style={{ margin: '0', color: TEXT_LIGHT, fontSize: '0.85rem' }}>
          Tamanho máximo: {maxSize / 1024 / 1024}MB
        </p>
      </label>

      {uploading && (
        <div style={{ marginTop: '1.5rem' }}>
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'rgba(0, 29, 68, 0.1)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                backgroundColor: SECONDARY_COLOR,
                width: `${uploadProgress}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <p style={{ margin: '0.5rem 0 0', color: TEXT_LIGHT, fontSize: '0.85rem' }}>
            {uploadProgress}%
          </p>
        </div>
      )}
    </div>
  )
}

export default ImageUploader
