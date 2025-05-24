<template>
  <div class="min-h-screen bg-gray-100">
    <AppNavbar />

    <main class="container mx-auto px-4 py-8">
      <div class="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <!-- Judul: Putih backgroundnya dihapus, teks jadi hitam -->
        <div class="px-6 py-4">
          <h2 class="text-2xl font-bold text-gray-800">Login to Student Club</h2>
        </div>

        <form @submit.prevent="handleLogin" class="p-6">
          <!-- Error Message -->
          <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {{ errorMessage }}
          </div>

          <!-- Email Field -->
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
              Email
            </label>
            <input
              v-model="form.email"
              id="email"
              type="email"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              placeholder="Enter your email"
              required
            />
          </div>

          <!-- Password Field -->
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
              Password
            </label>
            <input
              v-model="form.password"
              id="password"
              type="password"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              placeholder="Enter your password"
              required
            />
          </div>

          <!-- Submit Button -->
          <div class="flex items-center justify-center">
            <button
              type="submit"
              class="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 transition duration-200"
              :disabled="loading"
              :class="{ 'opacity-50 cursor-not-allowed': loading }"
            >
              <span v-if="!loading">Login</span>
              <span v-else>
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '../../services/auth.service'
import AppNavbar from '../../components/Navbar.vue'

export default {
  name: 'AuthLogin',
  components: { AppNavbar },

  setup() {
    const router = useRouter()
    const loading = ref(false)
    const errorMessage = ref('')

    const form = reactive({
      email: '',
      password: ''
    })

    const handleLogin = async () => {
      loading.value = true
      errorMessage.value = ''

      try {
        const response = await AuthService.login(form.email, form.password)
        localStorage.setItem('token', response.data.token)
        router.push('/dashboard')
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            errorMessage.value = 'Invalid email or password'
          } else if (error.response.status === 422) {
            errorMessage.value = 'Validation error. Please check your input.'
          } else {
            errorMessage.value = error.response.data?.error || 'Login failed. Please try again.'
          }
        } else if (error.request) {
          errorMessage.value = 'Network error. Please check your connection.'
        } else {
          errorMessage.value = 'An unexpected error occurred.'
        }

        console.error('Login error:', error)
      } finally {
        loading.value = false
        console.log('Token setelah login:', localStorage.getItem('token'))
      }
    }

    return {
      form,
      handleLogin,
      loading,
      errorMessage
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
