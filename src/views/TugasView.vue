<template>
  <div class="min-h-screen bg-gray-100">
    <AppNavbar />

    <main class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row lg:items-start gap-6">
        <!-- Filter Sidebar -->
        <div class="w-full lg:w-1/4 bg-white p-4 rounded-lg shadow">
          <h2 class="text-lg font-semibold text-black mb-4">Filter</h2>
          <div class="flex lg:flex-col gap-2">
            <button
              v-for="option in ['all', 'submitted', 'not-submitted']"
              :key="option"
              @click="selectedFilter = option"
              :class="[
                'px-4 py-2 text-left rounded-md font-medium',
                selectedFilter === option
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              ]"
            >
              {{
                option === 'all'
                  ? 'Semua'
                  : option === 'submitted'
                  ? 'Sudah Submit'
                  : 'Belum Submit'
              }}
            </button>
          </div>
        </div>

        <!-- Assignment Cards -->
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-black mb-6">Daftar Tugas</h1>

          <!-- Loading Spinner -->
          <div v-if="loading" class="text-center py-8">
            <div
              class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"
            ></div>
            <p class="mt-2">Loading data...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredAssignments.length === 0" class="text-center py-8 bg-white rounded-lg shadow">
            <p class="text-gray-500 text-lg">
              {{ getEmptyStateMessage() }}
            </p>
          </div>

          <!-- Assignment List -->
          <div v-else class="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            <router-link
              v-for="assignment in filteredAssignments"
              :key="assignment.id"
              :to="`/courses/${assignment.course_id}/assignments/${assignment.id}`"
              class="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 border-l-4 border-gray-500"
            >
              <div class="flex justify-between items-start mb-2">
                <h2 class="text-xl font-semibold text-black">{{ assignment.title }}</h2>
                <span 
                  class="px-2 py-1 text-xs rounded-full font-medium"
                  :class="assignment.has_submit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ assignment.has_submit ? 'Sudah dikumpulkan' : 'Belum dikumpulkan' }}
                </span>
              </div>
              <p class="text-gray-700 mb-2 line-clamp-2">{{ assignment.description }}</p>
              <p class="text-sm text-gray-500">Deadline: {{ formatDate(assignment.due_date) }}</p>
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import coursesService from '@/services/courses'
import AppNavbar from '@/components/Navbar.vue'

const route = useRoute()
const assignments = ref([])
const selectedFilter = ref('all')
const loading = ref(true)

onMounted(async () => {
  try {
    assignments.value = await coursesService.getUserAssignmentsWithCourses()
  } catch (error) {
    console.error('Gagal fetch data:', error)
  } finally {
    loading.value = false
  }
})

const filteredAssignments = computed(() => {
  if (selectedFilter.value === 'submitted') {
    return assignments.value.filter(a => a.has_submit)
  } else if (selectedFilter.value === 'not-submitted') {
    return assignments.value.filter(a => !a.has_submit)
  }
  return assignments.value
})

function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateStr).toLocaleDateString('id-ID', options)
}

function getEmptyStateMessage() {
  if (assignments.value.length === 0) {
    return 'Tidak ada tugas'
  }
  
  switch (selectedFilter.value) {
    case 'submitted':
      return 'Tidak ada tugas yang sudah submit'
    case 'not-submitted':
      return 'Tidak ada tugas yang belum submit'
    default:
      return 'Tidak ada tugas'
  }
}
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>