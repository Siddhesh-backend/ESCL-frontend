import api from './api'

const BASE = '/contacts'

const contactService = {
  getAll: (params) => api.get(BASE, { params }).then((res) => res.data),
  create: (payload) => api.post(BASE, payload).then((res) => res.data),
  remove: (id) => api.delete(`${BASE}/${id}`).then((res) => res.data),
}

export default contactService
