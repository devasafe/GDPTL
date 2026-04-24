import mongoose from 'mongoose';

const MidiaSchema = new mongoose.Schema(
  {
    url: String,
    tipo: { type: String, enum: ['foto', 'video'], default: 'foto' },
    publicId: String,
  },
  { _id: false }
);

const CaracteristicaSchema = new mongoose.Schema(
  {
    titulo: String,
    icone: String,
    valor: String,
  },
  { _id: false }
);

const ImovelSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    tipo: { type: String, required: true },
    cidade: { type: String, required: true },
    bairro: { type: String, required: true },
    preco: { type: Number, required: true },
    area: Number,
    quartos: Number,
    suites: Number,
    vagas: Number,
    banheiros: Number,
    diferencial: String,
    descricao: String,
    tags: [String],
    caracteristicas: [CaracteristicaSchema],
    destaque: { type: Boolean, default: false },
    canalPro: { type: Boolean, default: false },
    status: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' },
    midias: [MidiaSchema],
    localizacao: {
      lat: Number,
      lng: Number,
      endereco: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Imovel', ImovelSchema);
