<template>
  <div class="min-h-screen bg-gray-100">
    <AppNavbar />

    <main class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow-md p-6 pb-10 relative">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold text-black">Dashboard</h1>
          <router-link 
            to="/daftarmatakuliah"
            class="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-[16px] rounded-md hover:bg-gray-800 transition"
          >
            Enroll Mata Kuliah Baru<ArrowRight class="w-5 h-5" />
          </router-link>
        </div>

        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
          <p class="mt-2">Loading data...</p>
        </div>

        <div v-else-if="error" class="text-center text-red-500 py-8">
          <p>{{ error }}</p>
        </div>

        <div v-else>
          <section class="mb-12">
            <h2 class="text-xl font-semibold text-black mb-4 ml-2">Mata Kuliah Saya</h2>
            <ul class="grid md:grid-cols-2 gap-4">
              <li
                v-for="course in courses"
                :key="course.id"
                @click="$router.push(`/courses/${course.id}`)"
                class="border-2 border-gray-300 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div class="flex items-start gap-4">
                  <div class="p-2 rounded-full bg-gray-100">
                    <component 
                      :is="getIconForCourse(course)" 
                      class="w-6 h-6 text-gray-700"
                    />
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800">{{ course.name }}</p>
                    <p class="text-gray-600 text-sm">{{ course.code }}</p>
                    <p class="text-gray-600 text-sm mt-1">SKS: {{ course.credits }}</p>
                  </div>
                </div>
              </li>
            </ul>
          </section>

          <!-- Garis pemisah yang lebih tebal -->
          <div class="border-t-2 border-gray-300 my-10"></div>

          <section>
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-black ml-2">Tugas Anda yang Belum Selesai</h2>
              <select 
                v-model="selectedCourse"
                @change="filterByCourse"
                class="px-4 py-2 text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="">Semua Mata Kuliah</option>
                <option 
                  v-for="course in courses" 
                  :key="course.id" 
                  :value="course.id"
                >
                  {{ course.name }}
                </option>
              </select>
            </div>

            <div v-if="assignmentsLoading" class="text-center py-4">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black mx-auto"></div>
              <p class="mt-2">Memuat daftar tugas...</p>
            </div>
            <div v-else-if="assignmentsError" class="text-center text-red-500 py-4">
              <p>{{ assignmentsError }}</p>
            </div>
            <div v-else-if="filteredAssignments.length === 0" class="text-center py-4 text-gray-500">
              <p>Tidak ada tugas yang belum dikumpulkan</p>
            </div>
            <ul v-else class="space-y-3 mt-6">
              <li
                v-for="assignment in filteredAssignments"
                :key="assignment.id"
                class="border-2 border-gray-300 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                @click="$router.push(`/courses/${assignment.course_id}/assignments/${assignment.id}`)"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-semibold text-gray-800">{{ assignment.title }}</p>
                    <p class="text-gray-600 text-sm">
                      Mata Kuliah: {{ getCourseName(assignment.course_id) }}
                    </p>
                    <p class="text-gray-600 text-sm">
                      Deadline: {{ formatDate(assignment.due_date) }}
                    </p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                      Belum dikumpulkan
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowRight, BookA, Bookmark, Notebook } from 'lucide-vue-next'
import AppNavbar from '@/components/Navbar.vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = ref({})
const courses = ref([])
const assignments = ref([])
const loading = ref(true)
const assignmentsLoading = ref(true)
const error = ref(null)
const assignmentsError = ref(null)
const selectedCourse = ref('')

const stableIcons = [BookA, Bookmark, Notebook]

const getIconForCourse = (course) => {
  const index = course.id % stableIcons.length
  return stableIcons[index]
}

const fetchUserData = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/users/_self', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    user.value = response.data
  } catch (err) {
    console.error('Failed to fetch user data:', err)
    error.value = err.response?.data?.message || 'Sesi anda telah berakhir, silakan logout lalu login kembali'
  }
}

const fetchCourses = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/users/_self/courses', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    courses.value = response.data.data || response.data
  } catch (err) {
    console.error('Failed to fetch courses:', err)
    error.value = err.response?.data?.message || 'Sesi anda telah berakhir, silakan logout lalu login kembali'
  }
}

const fetchAssignments = async () => {
  assignmentsLoading.value = true
  try {
    const response = await axios.get('http://localhost:8000/api/users/_self/assignments', {
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

const filteredAssignments = computed(() => {
  let filtered = assignments.value.filter(a => !a.has_submit)
  if (selectedCourse.value) {
    filtered = filtered.filter(a => a.course_id == selectedCourse.value)
  }
  return filtered
})

const filterByCourse = () => {}

const getCourseName = (courseId) => {
  const course = courses.value.find(c => c.id === courseId)
  return course ? course.name : 'Unknown Course'
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

onMounted(async () => {
  try {
    await Promise.all([fetchUserData(), fetchCourses(), fetchAssignments()])
  } catch (err) {
    console.error('Initialization error:', err)
  } finally {
    loading.value = false
  }
})
</script>
