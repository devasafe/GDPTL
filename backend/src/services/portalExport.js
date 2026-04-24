import Imovel from '../models/Imovel.js';

export const exportarPortal = async ({ limit = 50, formato = 'json' }) => {
  const imoveis = await Imovel.find({ status: 'ativo' })
    .sort({ destaque: -1, createdAt: -1 })
    .limit(limit)
    .lean();

  if (formato === 'csv') {
    const header = Object.keys(imoveis[0] || {}).join(',');
    const rows = imoveis.map((row) =>
      Object.values(row)
        .map((v) => (typeof v === 'string' ? v.replace(/,/g, ' ') : v))
        .join(',')
    );
    return [header, ...rows].join('\n');
  }

  return { total: imoveis.length, items: imoveis };
};
