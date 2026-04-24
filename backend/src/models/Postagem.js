import mongoose from 'mongoose';

const PostagemSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    conteudo: { type: String, required: true },
    imagem: String,
    categoria: { type: String, enum: ['evento', 'noticia', 'outro'], default: 'noticia' },
    status: { type: String, enum: ['publicado', 'rascunho'], default: 'publicado' },
    dataPublicacao: { type: Date, default: Date.now },
    dataEvento: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Postagem', PostagemSchema);
