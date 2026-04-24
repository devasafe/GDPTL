import Secao from '../models/Secao.js'
import Imovel from '../models/Imovel.js'

const MAX_LIMIT = 50

const criterioToQuery = (secao) => {
  const { tipo, criterio } = secao
  const base = { status: 'ativo' }
  switch (tipo) {
    case 'cidade':
      return { ...base, cidade: { $regex: criterio.cidade || '', $options: 'i' } }
    case 'tag':
      return { ...base, tags: criterio.tag }
    case 'destaque':
      return { ...base, destaque: true }
    case 'custom':
      return { ...base, slug: { $in: Array.isArray(criterio.slugs) ? criterio.slugs : [] } }
    case 'query':
      // simple, only allow basic eq filters from criterio
      return { ...base, ...(criterio || {}) }
    default:
      return base
  }
}

export const listar = async (req, res, next) => {
  try {
    const sessoes = await Secao.find().sort({ ordem: 1, createdAt: -1 })
    res.json(sessoes)
  } catch (err) {
    next(err)
  }
}

export const obter = async (req, res, next) => {
  try {
    const s = await Secao.findById(req.params.id)
    if (!s) return res.status(404).json({ error: 'Seção não encontrada' })
    res.json(s)
  } catch (err) {
    next(err)
  }
}

export const criar = async (req, res, next) => {
  try {
    const novo = await Secao.create(req.body)
    res.status(201).json(novo)
  } catch (err) {
    next(err)
  }
}

export const atualizar = async (req, res, next) => {
  try {
    const atualizado = await Secao.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!atualizado) return res.status(404).json({ error: 'Seção não encontrada' })
    res.json(atualizado)
  } catch (err) {
    next(err)
  }
}

export const remover = async (req, res, next) => {
  try {
    const removed = await Secao.findByIdAndDelete(req.params.id)
    if (!removed) return res.status(404).json({ error: 'Seção não encontrada' })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

// Public render endpoint: returns active sections with items
export const render = async (req, res, next) => {
  try {
    const sessoes = await Secao.find({ ativa: true }).sort({ ordem: 1, createdAt: -1 }).lean()

    const results = []
    for (const s of sessoes) {
      const query = criterioToQuery(s)
      const limit = Math.min(Number(s.limite || 6), MAX_LIMIT)
      const sort = (() => {
        if (!s.ordenacao) return { destaque: -1, createdAt: -1 }
        if (s.ordenacao === 'preco') return { preco: 1 }
        if (s.ordenacao === '-preco') return { preco: -1 }
        if (s.ordenacao === 'data') return { createdAt: -1 }
        return { destaque: -1, createdAt: -1 }
      })()

      const items = await Imovel.find(query).sort(sort).limit(limit).lean()
      results.push({ _id: s._id, titulo: s.titulo, slug: s.slug, tipo: s.tipo, limite: limit, ordem: s.ordem || 0, items })
    }

    res.json(results)
  } catch (err) {
    next(err)
  }
}

// Public endpoint: returns imoveis for a specific section
export const renderBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params
    const secao = await Secao.findOne({ slug, ativa: true }).lean()
    
    if (!secao) return res.status(404).json({ error: 'Seção não encontrada' })
    
    const query = criterioToQuery(secao)
    const limit = Math.min(Number(secao.limite || 100), MAX_LIMIT * 2)
    const sort = (() => {
      if (!secao.ordenacao) return { destaque: -1, createdAt: -1 }
      if (secao.ordenacao === 'preco') return { preco: 1 }
      if (secao.ordenacao === '-preco') return { preco: -1 }
      if (secao.ordenacao === 'data') return { createdAt: -1 }
      return { destaque: -1, createdAt: -1 }
    })()

    const items = await Imovel.find(query).sort(sort).limit(limit).lean()
    res.json(items)
  } catch (err) {
    next(err)
  }
}
