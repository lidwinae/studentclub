<script setup>
const props = defineProps({
  course: Object,
  title: String,
  code: String,
  credits: Number
})

</script>

<template>
  <div class="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transitions">
    <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
    <p class="text-gray-500 text-sm mb-1">Kode: {{ code }}</p>
    <p class="text-gray-500 text-sm mb-4">Bobot: {{ credits }} SKS</p>
<router-link
  v-if="course?.id"
  :to="{ name: 'CourseDetail', params: { id: course.id } }"
  class="text-green-600 hover:underline"
>
  Lihat Detail →
</router-link>

  </div>
</template>
