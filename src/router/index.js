import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '../views/Welcome.vue'
import Dashboard from '../views/Dashboard.vue'
import DaftarMatakuliah from '../views/DaftarMatakuliah.vue'
import Login from '../views/Auth/Login.vue'
import Profile from '../views/Profile.vue'
import Materi from '../views/Materi.vue'
import Tugas from '../views/Tugas.vue'
import TugasView from '../views/TugasView.vue'

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: Welcome
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/daftarmatakuliah',
    name: 'DaftarMatakuliah',
    component: DaftarMatakuliah,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: '/courses/:course',
    name: 'Materi',
    component: Materi,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/courses/:course/assignments/:assignment',
    name: 'Tugas',
    component: Tugas,
    meta: { requiresAuth: true },
    props: true
  },
  { path: '/tugas', 
    name: 'TugasView', 
    component: TugasView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard untuk auth
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.guestOnly && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router