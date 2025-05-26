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
            
            <div v-if="materialsLoading" class="text-center py-8">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
              <p>Memuat daftar materi...</p>
            </div>
            <div v-else-if="materialsError" class="text-center text-red-500 py-4">
              <p>{{ materialsError }}</p>
            </div>
            <div v-else-if="materials.length === 0" class="text-center py-4 text-gray-500">
              <p>Tidak ada materi yang ditemukan</p>
            </div>
            <div v-else class="space-y-6">
              <div 
                v-for="material in materials" 
                :key="material.id"
                class="border-2 border-gray-200 rounded-lg p-6 bg-white"
              >
                <h3 class="text-lg font-semibold text-gray-800 mb-3">{{ material.title }}</h3>
                <div class="prose max-w-none text-gray-700" v-html="material.content"></div>
              </div>
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
import coursesService from '@/services/courses'

const route = useRoute()

// Data state
const course = ref({})
const materials = ref([])
const assignments = ref([])
const loading = ref(true)
const materialsLoading = ref(true)
const assignmentsLoading = ref(true)
const error = ref(null)
const materialsError = ref(null)
const assignmentsError = ref(null)

// Fetch course data
const fetchCourse = async () => {
  try {
    course.value = await coursesService.getCourseDetail(route.params.course)
  } catch (err) {
    console.error('Failed to fetch course data:', err)
    error.value = err.response?.data?.message || err.message || 'Sesi anda telah berakhir, silakan logout lalu login kembali'
  } finally {
    loading.value = false
  }
}

// Fetch materials for this course
const fetchMaterials = async () => {
  materialsLoading.value = true
  try {
    const response = await axios.get(`http://localhost:8000/api/courses/${route.params.course}/materials`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    materials.value = response.data.data || response.data
  } catch (err) {
    console.error('Failed to fetch materials:', err)
    materialsError.value = err.response?.data?.message || 'Gagal memuat materi'
  } finally {
    materialsLoading.value = false
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
    assignmentsError.value = err.response?.data?.message || 'Sesi anda telah berakhir, silakan logout lalu login kembali'
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
  await Promise.all([fetchCourse(), fetchMaterials(), fetchAssignments()])
})
</script>

<style scoped>
.prose {
  line-height: 1.6;
}

.prose p {
  margin-bottom: 1em;
}
</style>