import { Router } from 'express'
import { listar, obter, criar, atualizar, remover, render, renderBySlug } from '../controllers/sessoesController.js'
import { ensureAuth } from '../middleware/auth.js'
import Secao from '../models/Secao.js'

const router = Router()

// public list endpoint (for debugging)
router.get('/admin/list-all', async (req, res) => {
  try {
    const sessoes = await Secao.find().sort({ ordem: 1 })
    res.json(sessoes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// public render endpoint
router.get('/render', render)

// public render by slug endpoint
router.get('/slug/:slug', renderBySlug)

// admin endpoints
router.get('/', ensureAuth, listar)
router.get('/:id', ensureAuth, obter)
router.post('/', ensureAuth, criar)
router.put('/:id', ensureAuth, atualizar)
router.delete('/:id', ensureAuth, remover)

// cleanup endpoint (remove all and create default ones) - TEMPORARY, NO AUTH
router.post('/admin/reset-sessoes', async (req, res) => {
  try {
    // Delete all sessions
    await Secao.deleteMany({})
    
    // Create new ones with correct order
    const created = await Secao.create([
      {
        titulo: 'Novidades',
        slug: 'novidades',
        tipo: 'destaque',
        criterio: {},
        limite: 6,
        ordenacao: 'destaque',
        ativa: true,
        ordem: 0
      },
      {
        titulo: 'Casas em Cabo Frio',
        slug: 'casas-cabo-frio',
        tipo: 'cidade',
        criterio: { cidade: 'Cabo Frio' },
        limite: 6,
        ordenacao: 'destaque',
        ativa: true,
        ordem: 1
      }
    ])
    
    res.json({ success: true, message: 'Sessões resetadas com sucesso', data: created })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// delete all sessions
router.post('/admin/delete-all', async (req, res) => {
  try {
    const result = await Secao.deleteMany({})
    res.json({ success: true, message: 'Todas as sessões foram deletadas', deletedCount: result.deletedCount })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// create noticias e eventos
router.post('/admin/create-noticias', async (req, res) => {
  try {
    const created = await Secao.create({
      titulo: 'Notícias e Eventos',
      slug: 'noticias-eventos',
      tipo: 'custom',
      criterio: {},
      limite: 6,
      ordenacao: 'data',
      ativa: true,
      ordem: 2
    })
    res.json({ success: true, data: created })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// update novidades to show latest items
router.post('/admin/fix-novidades', async (req, res) => {
  try {
    const updated = await Secao.findByIdAndUpdate(
      '694a0f651de16223851b2fc7',
      {
        tipo: 'query',
        criterio: { status: 'ativo' },
        ordenacao: 'data'
      },
      { new: true }
    )
    res.json({ success: true, data: updated })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
