import api from './api'

export default {
  getAllCourses() {
    return api.get('/courses')
  },
  enrollCourse(id) {
    return api.post(`/courses/${id}`)
  }
}