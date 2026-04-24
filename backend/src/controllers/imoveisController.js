import Imovel from '../models/Imovel.js';

export const listar = async (req, res, next) => {
  try {
    const imoveis = await Imovel.find().sort({ destaque: -1, createdAt: -1 });
    res.json(imoveis);
  } catch (err) {
    next(err);
  }
};

export const obterPorSlug = async (req, res, next) => {
  try {
    const imovel = await Imovel.findOne({ slug: req.params.slug });
    if (!imovel) return res.status(404).json({ error: 'Não encontrado' });
    res.json(imovel);
  } catch (err) {
    next(err);
  }
};

export const criar = async (req, res, next) => {
  try {
    const novo = await Imovel.create(req.body);
    res.status(201).json(novo);
  } catch (err) {
    next(err);
  }
};

export const atualizar = async (req, res, next) => {
  try {
    const atualizado = await Imovel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!atualizado) return res.status(404).json({ error: 'Não encontrado' });
    res.json(atualizado);
  } catch (err) {
    next(err);
  }
};

export const remover = async (req, res, next) => {
  try {
    const removido = await Imovel.findByIdAndDelete(req.params.id);
    if (!removido) return res.status(404).json({ error: 'Não encontrado' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
