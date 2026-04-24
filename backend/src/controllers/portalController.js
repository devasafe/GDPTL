import { exportarPortal } from '../services/portalExport.js';

export const exportar = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 50;
    const formato = req.query.format || 'json';
    const payload = await exportarPortal({ limit, formato });

    if (formato === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.send(payload);
    } else {
      res.json(payload);
    }
  } catch (err) {
    next(err);
  }
};
