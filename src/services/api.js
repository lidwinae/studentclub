import axios from 'axios'
import router from '../router' // Pastikan Anda mengimport router yang benar

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor untuk menambahkan token ke header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor untuk menangani response error
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // Jika status 401 (Unauthorized) - biasanya token expired/tidak valid
      if (error.response.status === 401) {
        // Hapus token dari localStorage
        localStorage.removeItem('token')
        
        // Redirect ke halaman login
        router.push('/login') // Sesuaikan dengan path login Anda
        
        // Anda juga bisa menambahkan notifikasi/toast di sini
        console.log('Session expired, please login again')
      }
    }
    return Promise.reject(error)
  }
)

export default api