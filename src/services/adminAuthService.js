

import api from './api'

const adminAuthService = {
    login: (payload) =>
        api.post('/admin/auth/login', payload).then((response) => response.data),

    getCurrentUser: () =>
        api.get('/admin/auth/me').then((response) => response.data),

    logout: () =>
        api.post('/admin/auth/logout').then((response) => response.data),
}

export default adminAuthService
