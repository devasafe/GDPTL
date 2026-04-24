# Sistema de Upload de Imagens e Vídeos - Cloudinary

## 📋 Configuração

### 1. Variáveis de Ambiente (.env)

Adicione as seguintes variáveis ao arquivo `backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=df4v7hitl
CLOUDINARY_API_KEY=721921683436594
CLOUDINARY_API_SECRET=nv46eZDRm3lQdZwNoE7jW1KBesg
```

**✅ Já configurado!** As credenciais acima já estão no `backend/.env`

## 🎨 Componente Frontend: ImageUploader

### Uso Básico (Upload Único)

```jsx
import ImageUploader from '../components/ImageUploader'

function MinhaPage() {
  const handleUploadSuccess = (files) => {
    console.log('Upload bem-sucedido:', files)
    // files[0].url - URL da imagem
    // files[0].publicId - ID público (para deletar depois)
  }

  const handleUploadError = (error) => {
    console.error('Erro:', error)
  }

  return (
    <ImageUploader
      onUploadSuccess={handleUploadSuccess}
      onUploadError={handleUploadError}
      accept="image/*"
      maxSize={5 * 1024 * 1024} // 5MB
    />
  )
}
```

### Upload Múltiplo

```jsx
<ImageUploader
  multiple={true}
  onUploadSuccess={(files) => {
    files.forEach(file => {
      console.log(file.url) // URL de cada arquivo
    })
  }}
  onUploadError={handleError}
  accept="image/*,video/*"
  maxSize={50 * 1024 * 1024} // 50MB
/>
```

## 🔌 Serviço de Upload (uploadService.js)

### Métodos Disponíveis

#### 1. uploadImage(file)
Upload de um único arquivo

```javascript
import { uploadImage } from '../services/uploadService'

const file = document.querySelector('input[type="file"]').files[0]
const response = await uploadImage(file)
console.log(response.data.url) // URL da imagem
console.log(response.data.publicId) // ID para deletar
```

#### 2. uploadMultiple(files)
Upload de múltiplos arquivos

```javascript
import { uploadMultiple } from '../services/uploadService'

const files = document.querySelector('input[type="file"]').files
const response = await uploadMultiple(files)
response.data.files.forEach(file => {
  console.log(file.url) // URL de cada arquivo
})
```

#### 3. deleteFile(publicId)
Deletar um arquivo da Cloudinary

```javascript
import { deleteFile } from '../services/uploadService'

await deleteFile('guedes-capital/imoveis/abc123xyz')
console.log('Arquivo deletado com sucesso')
```

## 🛠️ Endpoints Backend

### POST /api/upload/image
Upload de uma única imagem

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body:**
```
file: <arquivo>
```

**Resposta:**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/...",
  "publicId": "guedes-capital/imoveis/abc123",
  "type": "image",
  "message": "Imagem enviada com sucesso"
}
```

### POST /api/upload/multiple
Upload de múltiplos arquivos

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body:**
```
files: <arquivo1>
files: <arquivo2>
files: <arquivo3>
...
```

**Resposta:**
```json
{
  "success": true,
  "files": [
    {
      "url": "https://res.cloudinary.com/...",
      "publicId": "guedes-capital/imoveis/abc123",
      "type": "image"
    }
  ],
  "message": "3 arquivo(s) enviado(s) com sucesso"
}
```

### DELETE /api/upload/:publicId
Deletar um arquivo

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "publicId": "guedes-capital/imoveis/abc123"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Arquivo deletado com sucesso"
}
```

## 📁 Estrutura de Pastas na Cloudinary

Os arquivos são organizados automaticamente em:
```
guedes-capital/
├── imoveis/
│   ├── casa-1920x1280.jpg
│   ├── apartamento-1920x1280.jpg
│   └── ...
├── postagens/
│   └── ...
└── ...
```

## 🎯 Exemplo Completo: Adicionar Imagem a um Imóvel

```jsx
import React, { useState } from 'react'
import ImageUploader from '../components/ImageUploader'
import { criarImovel } from '../services/imoveisService'

function CriarImovel() {
  const [formData, setFormData] = useState({
    titulo: '',
    capa: '',
    // ... outros campos
  })

  const handleUploadSuccess = (files) => {
    setFormData({
      ...formData,
      capa: files[0].url,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await criarImovel(formData)
    console.log('Imóvel criado:', response.data)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Título"
        value={formData.titulo}
        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
      />

      <h3>Upload de Imagem</h3>
      <ImageUploader
        onUploadSuccess={handleUploadSuccess}
        onUploadError={(error) => alert(error)}
        accept="image/*"
        maxSize={10 * 1024 * 1024}
      />

      {formData.capa && (
        <div>
          <p>Imagem selecionada: ✓</p>
          <img src={formData.capa} alt="Preview" style={{ maxWidth: '200px' }} />
        </div>
      )}

      <button type="submit">Criar Imóvel</button>
    </form>
  )
}

export default CriarImovel
```

## 🚀 Integração com PainelAdmin

Para adicionar upload no painel de admin, importe o componente:

```jsx
import ImageUploader from '../components/ImageUploader'

// No formulário de criação de imóvel
<ImageUploader
  onUploadSuccess={(files) => {
    setFormData({ ...formData, capa: files[0].url })
  }}
  onUploadError={(error) => setError(error)}
  accept="image/*"
/>
```

## ⚙️ Configurações Avançadas

### Limitar Tipos de Arquivo

```jsx
// Apenas imagens
accept="image/jpeg,image/png,image/webp"

// Apenas vídeos
accept="video/mp4,video/webm"

// Ambos
accept="image/*,video/*"
```

### Customizar Tamanho Máximo

```jsx
<ImageUploader
  maxSize={100 * 1024 * 1024} // 100MB
/>
```

### Armazenar publicId para Deletar Depois

```jsx
const [uploadedFiles, setUploadedFiles] = useState([])

const handleUploadSuccess = (files) => {
  setUploadedFiles([...uploadedFiles, ...files])
}

// Para deletar uma imagem:
const deleteImage = async (publicId) => {
  await deleteFile(publicId)
  setUploadedFiles(uploadedFiles.filter(f => f.publicId !== publicId))
}
```

## 🔐 Segurança

- ✅ Upload requer autenticação (JWT token)
- ✅ Validação de tamanho de arquivo no frontend e backend
- ✅ Arquivos organizados por pasta na Cloudinary
- ✅ CORS configurado corretamente

## 📞 Suporte Cloudinary

- Documentação: https://cloudinary.com/documentation
- API Reference: https://cloudinary.com/documentation/cloudinary_references
- Dashboard: https://cloudinary.com/console
