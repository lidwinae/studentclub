<template>
  <nav class="bg-black text-white shadow-lg">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <router-link to="/" class="text-2xl font-bold">Student Club</router-link>
      
      <!-- Desktop Navigation -->
      <div class="hidden md:flex space-x-1">
        <template v-if="isAuthenticated">
          <router-link 
            to="/dashboard" 
            class="px-4 py-2 rounded-t hover:bg-gray-800 transition-all relative"
            active-class="active-nav-link"
          >
            Dashboard
          </router-link>
          <router-link 
            to="/daftarmatakuliah" 
            class="px-4 py-2 rounded-t hover:bg-gray-800 transition-all relative"
            active-class="active-nav-link"
          >
            Daftar Mata Kuliah
          </router-link>
          <router-link 
            to="/tugas" 
            class="px-4 py-2 rounded-t hover:bg-gray-800 transition-all relative"
            active-class="active-nav-link"
          >
            List Tugas
          </router-link>
          <router-link 
            to="/profile" 
            class="px-4 py-2 rounded-t hover:bg-gray-800 transition-all relative"
            active-class="active-nav-link"
          >
            Profile
          </router-link>
          <button 
            @click="handleLogout" 
            class="px-4 py-2 rounded-t hover:bg-gray-800 transition-all"
          >
            Logout
          </button>
        </template>
        <template v-else>
          <router-link 
            to="/login" 
            class="px-4 py-2 rounded-t hover:bg-gray-800 transition-all relative"
            active-class="active-nav-link"
          >
            Login
          </router-link>
        </template>
      </div>
      
      <!-- Mobile Hamburger Button -->
      <button 
        @click="toggleMobileMenu" 
        class="md:hidden focus:outline-none"
        aria-label="Toggle menu"
      >
        <Menu class="w-6 h-6" v-if="!mobileMenuOpen" />
        <X class="w-6 h-6" v-else />
      </button>
    </div>
    
    <!-- Mobile Menu -->
    <div 
      class="md:hidden bg-gray-900 transition-all duration-300 ease-in-out overflow-hidden"
      :class="mobileMenuOpen ? 'max-h-screen' : 'max-h-0'"
    >
      <div class="container mx-auto px-4 py-2 flex flex-col space-y-2">
        <template v-if="isAuthenticated">
          <router-link 
            to="/dashboard" 
            class="px-4 py-3 hover:bg-gray-700 rounded transition-all"
            @click="mobileMenuOpen = false"
            active-class="bg-gray-800 font-medium"
          >
            Dashboard
          </router-link>
          <router-link 
            to="/daftarmatakuliah" 
            class="px-4 py-3 hover:bg-gray-700 rounded transition-all"
            @click="mobileMenuOpen = false"
            active-class="bg-gray-800 font-medium"
          >
            Daftar Mata Kuliah
          </router-link>
          <router-link 
            to="/tugas" 
            class="px-4 py-3 hover:bg-gray-700 rounded transition-all"
            @click="mobileMenuOpen = false"
            active-class="bg-gray-800 font-medium"
          >
            List Tugas
          </router-link>
          <router-link 
            to="/profile" 
            class="px-4 py-3 hover:bg-gray-700 rounded transition-all"
            @click="mobileMenuOpen = false"
            active-class="bg-gray-800 font-medium"
          >
            Profile
          </router-link>
          <button 
            @click="handleLogout" 
            class="px-4 py-3 text-left hover:bg-gray-700 rounded transition-all"
          >
            Logout
          </button>
        </template>
        <template v-else>
          <router-link 
            to="/login" 
            class="px-4 py-3 hover:bg-gray-700 rounded transition-all"
            @click="mobileMenuOpen = false"
            active-class="bg-gray-800 font-medium"
          >
            Login
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, X } from 'lucide-vue-next'
import AuthService from '../services/auth.service'

const router = useRouter()
const mobileMenuOpen = ref(false)

const isAuthenticated = computed(() => !!localStorage.getItem('token'))

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const handleLogout = async () => {
  try {
    localStorage.removeItem('token')
    mobileMenuOpen.value = false
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<style scoped>
.active-nav-link {
  position: relative;
}

.active-nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #d1d5db;
  border-radius: 3px 3px 0 0;
}

nav {
  border-bottom: 1px solid #374151;
}

/* Smooth transition for mobile menu */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: max-height 0.3s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  max-height: 0;
}
.mobile-menu-enter-to,
.mobile-menu-leave-from {
  max-height: 500px; /* Adjust based on your content */
}
</style>