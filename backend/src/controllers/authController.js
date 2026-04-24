import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export const login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;
    const user = await Usuario.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

    const ok = await bcrypt.compare(senha, user.senhaHash);
    if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

export const seedAdmin = async (req, res, next) => {
  try {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      return res.status(400).json({ error: 'Configure ADMIN_EMAIL e ADMIN_PASSWORD' });
    }

    const exists = await Usuario.findOne({ email: process.env.ADMIN_EMAIL });
    if (exists) return res.json({ ok: true, message: 'Admin já existe' });

    const senhaHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    const admin = await Usuario.create({
      nome: 'Administrador',
      email: process.env.ADMIN_EMAIL,
      senhaHash,
      role: 'admin',
    });

    res.status(201).json({ ok: true, id: admin.id });
  } catch (err) {
    next(err);
  }
};
