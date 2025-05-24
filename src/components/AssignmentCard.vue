<template>
  <div class="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition">
    <div class="flex justify-between items-start mb-2">
      <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
      <span
        class="text-sm font-medium"
        :class="isOverdue ? 'text-red-500' : 'text-green-600'"
      >
        {{ formatted }}
      </span>
    </div>
    <p class="text-gray-600 text-sm mb-4">{{ desc }}</p>
    <a href="#" class="text-sm text-indigo-600 hover:underline font-medium">Lihat Detail →</a>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)      // agar format "YYYY-MM-DD HH:mm:ss" tervalidasi

const props = defineProps({
  title: String,
  desc: String,
  deadline: String
})

const formatted = computed(() => {
  const d = dayjs(props.deadline, 'YYYY-MM-DD HH:mm:ss')  // parse sesuai format
  return d.isValid() ? d.format('DD/MM/YYYY') : '—'
})

// const d = computed(() => dayjs(props.deadline))
// const formattedDeadline = computed(() =>
//   d.value.isValid() ? d.value.format('DD/MM/YYYY') : 'Tanpa Batas Waktu'
// )

// const isOverdue = computed(() => d.value.isValid() && d.value.isBefore(dayjs()))
</script>
