import mongoose from 'mongoose'

const SecaoSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    tipo: { type: String, enum: ['destaque', 'cidade', 'tag', 'custom', 'query'], required: true },
    criterio: { type: mongoose.Schema.Types.Mixed, default: {} },
    limite: { type: Number, default: 6 },
    ordenacao: { type: String, default: 'destaque' },
    ativa: { type: Boolean, default: true },
    ordem: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('Secao', SecaoSchema)
