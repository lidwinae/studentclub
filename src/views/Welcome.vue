<template>
  <div class="min-h-screen bg-white flex flex-col">
    <AppNavbar />

    <main class="container mx-auto px-4 py-12 flex-grow">
      <!-- Bagian Hero -->
      <div class="flex flex-col-reverse md:flex-row items-center gap-10 mb-16">
        <!-- Gambar kiri -->
        <div class="w-full md:w-1/2">
          <img
            src="/book.svg"
            alt="Ilustrasi StudentClub"
            class="w-full h-auto grayscale object-contain"
          />
        </div>

        <!-- Teks kanan -->
        <div class="w-full md:w-1/2 text-center md:text-left">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Selamat Datang di StudentClub
          </h1>
          <p class="text-lg md:text-xl text-gray-600 mb-6">
            Platform akademik serbaguna untuk mengelola <span class="font-semibold">mata kuliah</span>, 
            <span class="font-semibold">mendapatkan materi</span>, dan <span class="font-semibold">penugasan</span> yang praktis dan efisien.
          </p>
          <p class="text-gray-500 text-sm">
            Lebih fokus. Lebih teratur. Lebih berprestasi.
          </p>
        </div>
      </div>

      <!-- Bagian Fitur -->
      <div class="grid gap-8 md:grid-cols-3 text-center">
        <div class="bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition">
          <BookOpen class="mx-auto text-gray-800 w-12 h-12 mb-4" />
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Manajemen Mata Kuliah</h2>
          <p class="text-gray-600 text-sm">
            Lihat dan kelola semua mata kuliah aktif dengan lebih mudah dan terstruktur.
          </p>
        </div>

        <div class="bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition">
          <ClipboardList class="mx-auto text-gray-800 w-12 h-12 mb-4" />
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Tugas Mahasiswa</h2>
          <p class="text-gray-600 text-sm">
            Lacak semua tugas dengan tenggat waktu yang jelas dan deskripsi lengkap.
          </p>
        </div>

        <div class="bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition">
          <UploadCloud class="mx-auto text-gray-800 w-12 h-12 mb-4" />
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Pengumpulan</h2>
          <p class="text-gray-600 text-sm">
            Unggah dan kelola hasil tugasmu secara aman dan tepat waktu.
          </p>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-black py-6 mt-16">
      <div class="container mx-auto text-center text-white text-sm">
        © {{ new Date().getFullYear() }} StudentClub. Dibuat oleh dan untuk mahasiswa.
      </div>
    </footer>
  </div>
</template>

<script>
import AppNavbar from '@/components/Navbar.vue'
import { BookOpen, ClipboardList, UploadCloud } from 'lucide-vue-next'

export default {
  name: 'AppWelcome',
  components: {
    AppNavbar,
    BookOpen,
    ClipboardList,
    UploadCloud
  }
}
</script>

<style scoped>
img {
  transition: transform 0.3s ease;
}
img:hover {
  transform: scale(1.02);
}
</style>
