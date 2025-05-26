<template>
  <div class="min-h-screen bg-gray-100">
    <AppNavbar />

    <main class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow-md p-6">
        <!-- Back Button -->
        <router-link
          to="/dashboard"
          class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft class="w-5 h-5" />
          Kembali ke Dashboard
        </router-link>

        <!-- Heading -->
        <h1 class="text-2xl font-bold mb-6 text-black">Daftar Semua Mata Kuliah</h1>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
          <p class="mt-2">Loading data...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center text-red-500 py-8">
          <p>{{ error }}</p>
        </div>

        <!-- Course Grid -->
        <div v-else class="grid md:grid-cols-2 gap-6">
          <div
            v-for="course in courses"
            :key="course.id"
            class="border-2 p-5 rounded-lg bg-gray-50 shadow-sm relative"
          >
            <div class="flex justify-between items-start">
              <div>
                <h2 class="text-lg font-semibold text-gray-800">{{ course.name }}</h2>
                <p class="text-sm text-gray-600">Kode: {{ course.code }}</p>
                <p class="text-sm text-gray-600">SKS: {{ course.credits }}</p>
              </div>
              
              <!-- Status dan Tombol Aksi -->
              <div class="flex flex-col items-end">
                <div v-if="course.has_enroll" class="flex items-center gap-1 text-green-600 text-sm mb-2">
                  <Check class="w-4 h-4" />
                  <span>Diambil</span>
                </div>
                
                <div class="flex gap-2">
                  <button
                    v-if="!course.has_enroll"
                    @click="handleEnroll(course.id)"
                    class="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm flex items-center gap-1"
                  >
                    <Plus class="w-4 h-4" />
                    Ambil
                  </button>
                  
                  <button
                    v-else
                    @click="handleUnenroll(course.id, course.name)"
                    class="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm flex items-center gap-1 mt-2"
                  >
                    <Trash2 class="w-4 h-4" />
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ArrowLeft, Check, Plus, Trash2 } from 'lucide-vue-next'
import AppNavbar from '@/components/Navbar.vue'
import coursesService from '@/services/courses'

const courses = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    courses.value = await coursesService.getAllCourses()
  } catch (err) {
    console.error('Gagal ambil daftar semua course:', err)
    error.value = 'Gagal memuat data mata kuliah'
  } finally {
    loading.value = false
  }
})

const handleEnroll = async (id) => {
  try {
    await coursesService.enrollCourse(id)
    alert('Berhasil ambil mata kuliah!')
    const course = courses.value.find(c => c.id === id)
    if (course) course.has_enroll = true
  } catch (err) {
    console.error('Gagal enroll:', err)
    alert('Terjadi kesalahan saat mengambil mata kuliah.')
  }
}

const handleUnenroll = async (id, name) => {
  const confirmed = confirm(`Yakin ingin membatalkan mata kuliah "${name}"?`)
  if (!confirmed) return

  try {
    await coursesService.unenrollCourse(id)
    alert('Berhasil membatalkan mata kuliah!')
    const course = courses.value.find(c => c.id === id)
    if (course) course.has_enroll = false
  } catch (err) {
    console.error('Gagal unenroll:', err)
    alert('Terjadi kesalahan saat membatalkan mata kuliah.')
  }
}
</script>