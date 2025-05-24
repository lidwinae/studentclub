<template>
  <div class="min-h-screen bg-gray-100">
    <AppNavbar />

    <main class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow-md p-6">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading data...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center text-red-500 py-8">
          <p>{{ error }}</p>
        </div>

        <!-- Course Content -->
        <div v-else>
          <!-- Course Header -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-black mb-2">{{ course.name }}</h1>
            <p class="text-gray-600">SKS: {{ course.credits }}</p>
          </div>

          <!-- Materi Section -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Materi</h2>
            <div class="prose max-w-none">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>
              <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
          </div>

          <!-- Assignments Section -->
          <div>
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Tugas</h2>

            <div v-if="assignmentsLoading" class="text-center py-8">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
              <p>Memuat daftar tugas...</p>
            </div>
            <div v-else-if="assignmentsError" class="text-center text-red-500 py-4">
              <p>{{ assignmentsError }}</p>
            </div>
            <div v-else-if="assignments.length === 0" class="text-center py-4 text-gray-500">
              <p>Tidak ada tugas yang ditemukan</p>
            </div>
            <ul v-else class="space-y-4">
              <router-link
                v-for="assignment in assignments"
                :key="assignment.id"
                :to="`/courses/${course.id}/assignments/${assignment.id}`"
                class="block border-2 border-gray-200 rounded-lg p-4 bg-white hover:border-black transition-colors hover:cursor-pointer"
                >
                <div class="flex justify-between items-start">
                    <div>
                    <p class="font-semibold text-gray-800">{{ assignment.title }}</p>
                    <p class="text-gray-600 text-sm">
                        Deadline: {{ formatDate(assignment.due_date) }}
                    </p>
                    </div>
                    <span 
                    class="px-2 py-1 text-xs rounded-full"
                    :class="assignment.has_submit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                    {{ assignment.has_submit ? 'Sudah dikumpulkan' : 'Belum dikumpulkan' }}
                    </span>
                </div>
                </router-link>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppNavbar from '@/components/Navbar.vue'
import axios from 'axios'

const route = useRoute()

// Data state
const course = ref({})
const assignments = ref([])
const loading = ref(true)
const assignmentsLoading = ref(true)
const error = ref(null)
const assignmentsError = ref(null)

// Fetch course data
const fetchCourse = async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/courses/${route.params.course}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    course.value = response.data
  } catch (err) {
    console.error('Failed to fetch course data:', err)
    error.value = err.response?.data?.message || 'Gagal memuat data mata kuliah'
  } finally {
    loading.value = false
  }
}

// Fetch assignments for this course
const fetchAssignments = async () => {
  assignmentsLoading.value = true
  try {
    const response = await axios.get(`http://localhost:8000/api/courses/${route.params.course}/assignments`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    assignments.value = response.data.data || response.data
  } catch (err) {
    console.error('Failed to fetch assignments:', err)
    assignmentsError.value = err.response?.data?.message || 'Gagal memuat daftar tugas'
  } finally {
    assignmentsLoading.value = false
  }
}

// Helper functions
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

// Initial data loading
onMounted(async () => {
  await Promise.all([fetchCourse(), fetchAssignments()])
})
</script>