import api from './api'

export default {
  getAllCourses() {
    return api.get('/courses')
      .then(response => response.data.data || response.data)
      .catch(error => {
        console.error('Error fetching courses:', error)
        throw error
      })
  },
  enrollCourse(id) {
    return api.post(`/courses/${id}`)
      .catch(error => {
        console.error('Error enrolling course:', error)
        throw error
      })
  },
  unenrollCourse(id) {
    return api.delete(`/courses/${id}`)
      .catch(error => {
        console.error('Error unenrolling course:', error)
        throw error
      })
  },
  getUserAssignmentsWithCourses() {
    return api.get('/users/_self/assignments?include=course')
      .then(response => response.data.data || response.data)
      .catch(error => {
        console.error('Error fetching assignments:', error)
        throw error
      })
  },
  getCourseDetail(courseId) {
    return api.get(`/courses/${courseId}`)
      .then(response => response.data)
      .catch(error => {
        console.error(`Error fetching course detail ${courseId}:`, error)
        throw error
      })
  }
}