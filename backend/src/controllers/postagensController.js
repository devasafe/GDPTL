import Postagem from '../models/Postagem.js';

export const listar = async (req, res, next) => {
  try {
    const postagens = await Postagem.find({ status: 'publicado' }).sort({ dataPublicacao: -1 });
    res.json(postagens);
  } catch (err) {
    next(err);
  }
};

export const listarTodas = async (req, res, next) => {
  try {
    const postagens = await Postagem.find().sort({ createdAt: -1 });
    res.json(postagens);
  } catch (err) {
    next(err);
  }
};

export const obterPorSlug = async (req, res, next) => {
  try {
    const postagem = await Postagem.findOne({ slug: req.params.slug });
    if (!postagem) return res.status(404).json({ error: 'Postagem não encontrada' });
    res.json(postagem);
  } catch (err) {
    next(err);
  }
};

export const criar = async (req, res, next) => {
  try {
    const nova = await Postagem.create(req.body);
    res.status(201).json(nova);
  } catch (err) {
    next(err);
  }
};

export const atualizar = async (req, res, next) => {
  try {
    const atualizada = await Postagem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!atualizada) return res.status(404).json({ error: 'Postagem não encontrada' });
    res.json(atualizada);
  } catch (err) {
    next(err);
  }
};

export const remover = async (req, res, next) => {
  try {
    const removida = await Postagem.findByIdAndDelete(req.params.id);
    if (!removida) return res.status(404).json({ error: 'Postagem não encontrada' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
