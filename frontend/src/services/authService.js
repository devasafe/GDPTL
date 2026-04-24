import api from './api';

export const login = async ({ email, senha }) => {
  const { data } = await api.post('/auth/login', { email, senha });
  return data; // { token }
};
