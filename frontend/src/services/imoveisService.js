import api from './api';

export const listarImoveis = async () => {
  const { data } = await api.get('/imoveis');
  return data;
};

export const listarImoveisPorSessao = async (slug) => {
  const { data } = await api.get(`/sessoes/slug/${slug}`);
  return data;
};

export const obterImovel = async (slug) => {
  const { data } = await api.get(`/imoveis/${slug}`);
  return data;
};

export const criarImovel = async (payload) => {
  const { data } = await api.post('/imoveis', payload);
  return data;
};

export const atualizarImovel = async (id, payload) => {
  const { data } = await api.put(`/imoveis/${id}`, payload);
  return data;
};

export const removerImovel = async (id) => {
  const { data } = await api.delete(`/imoveis/${id}`);
  return data;
};
