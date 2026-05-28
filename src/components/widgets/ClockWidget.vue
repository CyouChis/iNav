<template>
  <div class="text-center select-none">
    <div class="flex items-center justify-center gap-1" style="line-height: 1">
      <span
        class="text-white"
        style="font-size: 88px; font-weight: 200; letter-spacing: -0.02em; text-shadow: 0 2px 40px rgba(0,0,0,0.3)"
      >
        {{ h }}
      </span>
      <span
        class="text-white/60 mx-1"
        style="font-size: 72px; font-weight: 200"
      >
        :
      </span>
      <span
        class="text-white"
        style="font-size: 88px; font-weight: 200; letter-spacing: -0.02em; text-shadow: 0 2px 40px rgba(0,0,0,0.3)"
      >
        {{ m }}
      </span>
      <span
        class="text-white/40 ml-2 self-end mb-4"
        style="font-size: 32px; font-weight: 200"
      >
        {{ s }}
      </span>
    </div>
    <div class="text-white/60 mt-2" style="font-size: 16px; font-weight: 300; letter-spacing: 0.1em">
      {{ year }}年 {{ month }}{{ date }}日 {{ weekday }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

const now = ref(new Date())
let timer: number | null = null

const h = ref('')
const m = ref('')
const s = ref('')
const weekday = ref('')
const month = ref('')
const date = ref(0)
const year = ref(0)

function updateTime() {
  now.value = new Date()
  h.value = String(now.value.getHours()).padStart(2, '0')
  m.value = String(now.value.getMinutes()).padStart(2, '0')
  s.value = String(now.value.getSeconds()).padStart(2, '0')
  weekday.value = WEEKDAYS[now.value.getDay()]
  month.value = MONTHS[now.value.getMonth()]
  date.value = now.value.getDate()
  year.value = now.value.getFullYear()
}

onMounted(() => {
  updateTime()
  timer = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>
