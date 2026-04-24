import api from './api'

export const listarSessoes = async () => {
  const { data } = await api.get('/sessoes')
  return data
}

export const getRender = async () => {
  const { data } = await api.get('/sessoes/render')
  return data
}

export const criarSecao = async (payload) => {
  const { data } = await api.post('/sessoes', payload)
  return data
}

export const atualizarSecao = async (id, payload) => {
  const { data } = await api.put(`/sessoes/${id}`, payload)
  return data
}

export const removerSecao = async (id) => {
  const { data } = await api.delete(`/sessoes/${id}`)
  return data
}
