import api from './api'

export default {
  login(email, password) {
    return api.post('/auth/signin', { email, password })
  },
  getCurrentUser() {
    return api.get('/users/_self')
  }
}