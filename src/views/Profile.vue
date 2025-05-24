<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <AppNavbar />

    <main class="flex-grow px-4 py-8">
      <div class="bg-white rounded-lg shadow-md p-6 w-full max-w-md mx-auto mt-8"> <!-- Added mt-8 for top margin -->
        <h1 class="text-3xl font-bold text-black mb-6 text-center">Profile</h1>

        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading user data...</p>
        </div>

        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p class="text-red-600 font-medium">{{ error }}</p>
          <button 
            @click="fetchUserData"
            class="mt-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Try Again
          </button>
        </div>

        <div v-else>
          <div class="mb-4 space-y-3">
            <p class="text-gray-700">
              <span class="font-semibold inline-block w-20">Name:</span> 
              <span>{{ user.name }}</span>
            </p>
            <p class="text-gray-700">
              <span class="font-semibold inline-block w-20">Email:</span> 
              <span>{{ user.email }}</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import AuthService from '@/services/auth.service'
import AppNavbar from '@/components/Navbar.vue'

export default {
  name: 'Profile',
  components: { AppNavbar },

  setup() {
    const user = ref({})
    const loading = ref(true)
    const error = ref(null)

    const fetchUserData = async () => {
      try {
        loading.value = true
        error.value = null
        const response = await AuthService.getCurrentUser()
        user.value = response.data
      } catch (err) {
        error.value = err.response?.data?.message || 'Failed to load user data'
        console.error('Profile error:', err)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchUserData()
    })

    return {
      user,
      loading,
      error,
      fetchUserData
    }
  }
}
</script>