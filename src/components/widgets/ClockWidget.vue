<template>
  <div class="widget bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
    <h3 class="text-white/80 text-sm mb-2">时钟</h3>
    <div class="text-4xl font-bold text-white">{{ currentTime }}</div>
    <div class="text-white/60 mt-2">{{ currentDate }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const currentTime = ref('')
const currentDate = ref('')

let timer: number

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  currentDate.value = now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
}

onMounted(() => {
  updateTime()
  timer = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>
