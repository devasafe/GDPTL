import api from './api';

export const listarPostagens = async () => {
  const { data } = await api.get('/postagens');
  return data;
};

export const listarTodasPostagens = async () => {
  const { data } = await api.get('/postagens/todas');
  return data;
};

export const obterPostagem = async (slug) => {
  const { data } = await api.get(`/postagens/${slug}`);
  return data;
};

export const criarPostagem = async (payload) => {
  const { data } = await api.post('/postagens', payload);
  return data;
};

export const atualizarPostagem = async (id, payload) => {
  const { data } = await api.put(`/postagens/${id}`, payload);
  return data;
};

export const removerPostagem = async (id) => {
  const { data } = await api.delete(`/postagens/${id}`);
  return data;
};
