<template>
  <div class="clock-widget">
    <div class="clock-time" style="line-height: 1">
      <span
        class="clock-hour"
        style="font-size: 88px; font-weight: 200; letter-spacing: -0.02em; text-shadow: 0 2px 40px rgba(0,0,0,0.3)"
      >
        {{ h }}
      </span>
      <span
        class="clock-colon"
        style="font-size: 72px; font-weight: 200"
      >
        :
      </span>
      <span
        class="clock-minute"
        style="font-size: 88px; font-weight: 200; letter-spacing: -0.02em; text-shadow: 0 2px 40px rgba(0,0,0,0.3)"
      >
        {{ m }}
      </span>
      <span
        class="clock-second"
        style="font-size: 32px; font-weight: 200"
      >
        {{ s }}
      </span>
    </div>
    <div class="clock-date" style="font-size: 16px; font-weight: 300; letter-spacing: 0.1em">
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

<style scoped>
.clock-widget {
  text-align: center;
  user-select: none;
}

.clock-time {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.clock-hour,
.clock-minute {
  color: #fff;
}

.clock-colon {
  color: rgba(255, 255, 255, 0.6);
  margin: 0 4px;
}

.clock-second {
  color: rgba(255, 255, 255, 0.4);
  margin-left: 8px;
  align-self: flex-end;
  margin-bottom: 16px;
}

.clock-date {
  color: rgba(255, 255, 255, 0.6);
  margin-top: 8px;
}
</style>
