import api from './api'

const BASE = '/points-table'

const pointsTableService = {
  getAll: (params) => api.get(BASE, { params }).then((res) => res.data),
  create: (payload) => api.post(BASE, payload).then((res) => res.data),
  update: (id, payload) => api.put(`${BASE}/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`${BASE}/${id}`).then((res) => res.data),
}

export default pointsTableService
