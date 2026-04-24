# Guedes Capital Imobiliária

Projeto fullstack para catálogo de imóveis com painel admin.

## Stack
- Frontend: React + Vite (Vercel)
- Backend: Node.js + Express (Render)
- Banco: MongoDB Atlas
- Mídia: Cloudinary

## Como rodar
1. Frontend
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Backend
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run dev
   ```

## Variáveis de ambiente (backend)
- `MONGODB_URI`
- `PORT`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_SECRET`
- `WHATSAPP_URL_BASE`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Rotas principais (backend)
- `GET /health`
- `GET /api/imoveis` listar
- `GET /api/imoveis/:slug` detalhe
- `POST /api/imoveis` (token) criar
- `PUT /api/imoveis/:id` (token) atualizar
- `DELETE /api/imoveis/:id` (token) remover
- `POST /api/auth/login` login admin
- `POST /api/auth/seed-admin` seed inicial admin
- `GET /api/portal/export?limit=50&format=json|csv` (token) export portal

## TODO curto prazo
- Integrar login no frontend com `/api/auth/login`
- Conectar formulários ao backend
- Subir deploys (Vercel/Render) e configurar envs
