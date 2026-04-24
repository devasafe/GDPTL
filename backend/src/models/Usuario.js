import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senhaHash: { type: String, required: true },
    role: { type: String, default: 'admin' },
  },
  { timestamps: true }
);

export default mongoose.model('Usuario', UsuarioSchema);
