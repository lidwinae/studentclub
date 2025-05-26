import api from './api'

export default {
  /**
   * Mengambil daftar mata kuliah yang diambil oleh user
   * @returns {Promise<Array>} Array of courses
   */
  getMyCourses() {
    return api.get('/users/_self/courses')
      .then(response => response.data.data || response.data)
      .catch(error => {
        console.error('Error fetching courses:', error)
        throw error
      })
  },

  /**
   * Mengambil daftar tugas yang belum selesai
   * @returns {Promise<Array>} Array of assignments
   */
  getMyAssignments() {
    return api.get('/users/_self/assignments')
      .then(response => response.data.data || response.data)
      .catch(error => {
        console.error('Error fetching assignments:', error)
        throw error
      })
  }
}