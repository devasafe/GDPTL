import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoose from 'mongoose'
import imoveisRouter from './routes/imoveis.js'
import authRouter from './routes/auth.js'
import portalRouter from './routes/portal.js'
import postagensRouter from './routes/postagens.js'
import sessoesRouter from './routes/sessoes.js'
import uploadRouter from './routes/upload.js'
import canalProRouter from './routes/canalPro.js'

const app = express()
const PORT = process.env.PORT || 4001
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://MrMotah:153624@guedescapitalimobiliari.00vhhhp.mongodb.net/'

app.use(cors())
app.use(helmet())
app.use(express.json({ limit: '5mb' }))
app.use(morgan('dev'))

app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }))
console.log('✓ Rota /health registrada')
app.use('/api/imoveis', imoveisRouter)
console.log('✓ Rota /api/imoveis registrada')
app.use('/api/auth', authRouter)
console.log('✓ Rota /api/auth registrada')
app.use('/api/portal', portalRouter)
console.log('✓ Rota /api/portal registrada')
app.use('/api/postagens', postagensRouter)
console.log('✓ Rota /api/postagens registrada')
app.use('/api/sessoes', sessoesRouter)
console.log('✓ Rota /api/sessões registrada')
app.use('/api/upload', uploadRouter)
console.log('✓ Rota /api/upload registrada')
app.use('/api/canal-pro', canalProRouter)
console.log('✓ Rota /api/canal-pro registrada')

app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Erro interno' })
})

const connectWithRetry = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('Mongo conectado')
  } catch (err) {
    console.error('Falha ao conectar ao Mongo. Tentando novamente em 5s...')
    console.error(err?.message || err)
    setTimeout(connectWithRetry, 5000)
  }
}

app.listen(PORT, 'localhost', () => {
  console.log(`API rodando em http://localhost:${PORT}`)
  connectWithRetry().catch(console.error)
})
