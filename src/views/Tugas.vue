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
        <!-- Assignment Content -->
        <div v-else>
          <!-- Assignment Header -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-black mb-2">{{ assignment.title }}</h1>
            <div class="space-y-1 text-gray-600">
              <p>Mata Kuliah: {{ course.name }}</p>
              <p>Deadline: {{ formatDate(assignment.due_date) }}</p>
              <p v-if="submission && submission.grade !== null && submission.grade !== undefined" class="font-medium text-gray-800 mb-2">Nilai: {{ submission.grade }}</p>
              <div v-if="submission && submission.feedback !== null && submission.feedback !== undefined" class="mt-4 p-4 bg-gray-100 rounded-lg">
                <p class="font-medium text-gray-800 mb-2">Feedback:</p>
                <p class="text-gray-600 whitespace-pre-wrap">{{ submission.feedback }}</p>
              </div>
            </div>
          </div>
          <!-- Assignment Description -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Deskripsi Tugas</h2>
            <div class="prose max-w-none">
              <p>{{ assignment.description || 'Tidak ada deskripsi tambahan' }}</p>
            </div>
          </div>
          <!-- Submission Section -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">
              {{ submission ? 'Pengumpulan Anda' : 'Kirim Tugas' }}
            </h2>
            
            <!-- Submission Status -->
            <div v-if="submission" class="flex items-center gap-2 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-check-circle-2"
                :class="isSubmissionLate ? 'text-red-500' : 'text-green-500'"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span :class="isSubmissionLate ? 'text-red-600' : 'text-green-600'">
                Dikumpulkan pada {{ formatDate(submission.updated_at) }}
                <span v-if="isSubmissionLate" class="font-semibold"> (Terlambat)</span>
              </span>
            </div>

            <!-- Submission Form -->
            <form @submit.prevent="submission ? handlePatch() : handlePost()" class="space-y-4">
              <!-- Text Answer -->
              <div>
                <label for="answer" class="block text-sm font-medium text-gray-700 mb-1">Jawaban Teks</label>
                <textarea
                  id="answer"
                  v-model="form.answer"
                  rows="5"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                  placeholder="Tulis jawaban Anda disini..."
                  :disabled="!isEditing && !!submission"
                ></textarea>
              </div>

              <!-- File Upload (Hanya tampil jika bukan mode edit atau belum pernah submit) -->
              <div v-if="!isEditing || !submission">
                <label for="file" class="block text-sm font-medium text-gray-700 mb-1">File Jawaban</label>
                <input
                  type="file"
                  id="file"
                  @change="handleFileUpload"
                  class="block w-full text-sm text-gray-700 
                        file:mr-4 file:py-2 file:px-4 
                        file:rounded-md file:border-0 
                        file:text-sm file:font-semibold 
                        file:bg-gray-200 file:text-black 
                        hover:file:bg-gray-300"
                  :disabled="!isEditing && !!submission"
                />
                <p v-if="form.file" class="mt-2 text-sm text-gray-600">
                  File baru: {{ form.file.name }}
                </p>
                <p v-else-if="submission?.file_url" class="mt-2 text-sm text-gray-600 break-words">
                  File terkumpul: {{ submission.file_url }}
                </p>
              </div>

              <!-- Submission Buttons -->
              <div class="flex gap-2">
                <template v-if="!submission">
                  <button
                    type="submit"
                    class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-colors"
                    :disabled="isUploading"
                  >
                    Kirim Tugas
                  </button>
                </template>
                <template v-else>
                  <button
                    v-if="!isEditing"
                    @click.prevent="isEditing = true"
                    type="button"
                    class="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                  >
                    Edit Teks
                  </button>
                  <template v-else>
                    <button
                      type="submit"
                      class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-colors"
                      :disabled="isUploading"
                    >
                      Update Jawaban
                    </button>
                    <button
                      @click.prevent="cancelEdit"
                      type="button"
                      class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                      Batal
                    </button>
                  </template>
                  <button
                    @click.prevent="handleDelete"
                    type="button"
                    class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                    :disabled="isUploading"
                  >
                    Hapus Pengumpulan
                  </button>
                </template>
              </div>
            </form>
            <!-- Feedback Section -->
            <div v-if="submission?.feedback" class="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 class="text-lg font-medium text-gray-800 mb-2">Feedback</h3>
              <p class="text-gray-600">{{ submission.feedback }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppNavbar from '@/components/Navbar.vue'
import axios from 'axios'
import coursesService from '@/services/courses'

const route = useRoute()
const router = useRouter()

const course = ref({})
const assignment = ref({})
const submission = ref(null)
const loading = ref(true)
const error = ref(null)
const isEditing = ref(false)
const isUploading = ref(false)

const form = ref({
  answer: '',
  file: null,
})

// Computed property untuk mengecek apakah pengumpulan terlambat
const isSubmissionLate = computed(() => {
  if (!submission.value || !assignment.value.due_date) return false
  const submissionDate = new Date(submission.value.updated_at)
  const deadline = new Date(assignment.value.due_date)
  return submissionDate > deadline
})

// Fetch data
const fetchData = async () => {
  try {
    loading.value = true
    const [assignmentRes, courseRes] = await Promise.all([
      axios.get(`http://localhost:8000/api/courses/${route.params.course}/assignments/${route.params.assignment}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }),
      coursesService.getCourseDetail(route.params.course)
    ])

    assignment.value = assignmentRes.data
    course.value = courseRes

    if (assignment.value.has_submit) {
      try {
        const submissionRes = await axios.get(
          `http://localhost:8000/api/courses/${route.params.course}/assignments/${route.params.assignment}/submissions`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
        )
        submission.value = submissionRes.data
        resetFormToSubmission()
      } catch (submissionErr) {
        if (submissionErr.response?.status !== 404) {
          console.error('Error fetching submission:', submissionErr)
        }
      }
    }
  } catch (err) {
    console.error('Failed to fetch data:', err)
    error.value = err.response?.data?.message || 'Sesi anda telah berakhir, silakan logout lalu login kembali'
  } finally {
    loading.value = false
  }
}

const handleFileUpload = (event) => {
  form.value.file = event.target.files[0]
}

const enableEditMode = () => {
  isEditing.value = true
  // Reset form agar sesuai submission
  resetFormToSubmission()
}

const cancelEdit = () => {
  isEditing.value = false
  resetFormToSubmission()
}

const resetFormToSubmission = () => {
  form.value.answer = submission.value?.answer || ''
  form.value.file = null
}

const handlePost = async () => {
  try {
    isUploading.value = true
    const formData = new FormData()
    if (form.value.answer) formData.append('answer', form.value.answer)
    if (form.value.file) formData.append('file', form.value.file)

    const url = `http://localhost:8000/api/courses/${route.params.course}/assignments/${route.params.assignment}/submissions`
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    }

    const response = await axios.post(url, formData, config)
    submission.value = response.data
    isEditing.value = false
    resetFormToSubmission()
    alert('Pengumpulan berhasil dikirim!')
    await fetchData()
  } catch (err) {
    console.error('Submission POST error:', err)
    const msg = err.response?.data?.errors
      ? Object.values(err.response.data.errors).flat().join(', ')
      : 'Gagal mengirim pengumpulan'
    alert(`Error: ${msg}`)
  } finally {
    isUploading.value = false
  }
}

const handlePatch = async () => {
  try {
    isUploading.value = true;
    let fileUrl = submission.value?.file_url || '';
    if (form.value.file) {
      try {
        fileUrl = 'URL_FILE_SETELAH_UPLOAD';

      } catch (uploadErr) {
        console.error('Upload error:', uploadErr);
        throw new Error(`Gagal mengunggah file: ${uploadErr.message}`);
      }
    }

    const payload = {
      answer: form.value.answer || '',
      ...(fileUrl ? { file_url: fileUrl } : {}),
      ...(!form.value.file && submission.value?.file_url ? { is_file_deleted: true } : {})
    };

    const url = `http://localhost:8000/api/courses/${route.params.course}/assignments/${route.params.assignment}/submissions`;
    const response = await axios.patch(url, payload, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    // update state
    submission.value = response.data;
    isEditing.value = false;
    form.value.file = null;
    form.value.file_url = response.data.file_url || '';

    alert('Pengumpulan berhasil diupdate!');
    await fetchData();
  } catch (err) {
    console.error('Patch error:', {
      error: err,
      response: err.response?.data
    });

    let errorMessage = 'Gagal mengupdate pengumpulan';
    if (err.message.includes('Gagal mengunggah file')) {
      errorMessage = err.message;
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.errors) {
      errorMessage = Object.values(err.response.data.errors).flat().join(', ');
    }

    alert(`Error: ${errorMessage}`);
  } finally {
    isUploading.value = false;
  }
};

const handleDelete = async () => {
  if (!confirm('Apakah Anda yakin ingin menghapus pengumpulan ini?')) return
  try {
    await axios.delete(
      `http://localhost:8000/api/courses/${route.params.course}/assignments/${route.params.assignment}/submissions`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    submission.value = null
    resetFormToSubmission()
    alert('Pengumpulan berhasil dihapus!')
  } catch (err) {
    console.error('Delete error:', err)
    alert(err.response?.data?.message || 'Gagal menghapus pengumpulan')
  }
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

onMounted(() => {
  fetchData()
})
</script>