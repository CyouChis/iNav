<template>
  <div class="search-widget">
    <div class="engine-selector">
      <el-button
        v-for="(e, i) in ENGINES"
        :key="e.name"
        :type="engine === i ? 'primary' : 'default'"
        round
        size="small"
        :style="{
          fontWeight: engine === i ? 600 : 400,
          backgroundColor: engine === i ? e.color + 'cc' : 'rgba(255,255,255,0.08)',
          borderColor: engine === i ? e.color + 'cc' : 'rgba(255,255,255,0.1)',
          color: engine === i ? 'white' : 'rgba(255,255,255,0.5)',
        }"
        @click="engine = i"
      >
        {{ e.name }}
      </el-button>
    </div>

    <form @submit.prevent="handleSearch">
      <div
        class="search-box"
        :style="{
          borderRadius: '20px',
          overflow: 'hidden',
          background: focused
            ? 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(180,140,255,0.10) 50%, rgba(120,80,255,0.08) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(160,120,255,0.08) 50%, rgba(100,60,220,0.06) 100%)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.28)',
          borderTop: '1.5px solid rgba(255,255,255,0.45)',
          borderBottom: '1px solid rgba(255,255,255,0.10)',
          boxShadow: focused
            ? 'inset 0 1.5px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(255,255,255,0.08), 0 0 0 2px rgba(180,160,255,0.45), 0 8px 48px rgba(100,60,255,0.35), 0 2px 80px rgba(180,100,255,0.18)'
            : 'inset 0 1.5px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(255,255,255,0.06), 0 4px 32px rgba(80,40,200,0.25), 0 1px 0 rgba(255,255,255,0.08)',
          transition: 'all 0.25s ease',
        }"
      >
        <div
          class="search-highlight"
          style="height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0.6) 70%, transparent); borderRadius: 1px"
        />
        <svg
          class="search-icon"
          :style="{
            color: focused ? 'rgba(200,180,255,0.95)' : 'rgba(255,255,255,0.45)',
            filter: focused ? 'drop-shadow(0 0 6px rgba(180,140,255,0.8))' : 'none',
          }"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref="inputRef"
          v-model="query"
          @focus="focused = true"
          @blur="focused = false"
          :placeholder="`在 ${ENGINES[engine].name} 中搜索...`"
          class="search-input"
          style="font-size: 16px; font-weight: 300; letter-spacing: 0.01em"
        />
        <Transition name="fade">
          <el-button
            v-if="query"
            type="primary"
            size="small"
            class="search-submit-btn"
            @click="handleSearch"
          >
            搜索
          </el-button>
        </Transition>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const ENGINES = [
  { name: 'Google', url: 'https://www.google.com/search?q=', color: '#4285F4' },
  { name: 'Bing', url: 'https://www.bing.com/search?q=', color: '#00A4EF' },
  { name: '百度', url: 'https://www.baidu.com/s?wd=', color: '#2932E1' },
]

const query = ref('')
const engine = ref(0)
const focused = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

function handleSearch() {
  if (!query.value.trim()) return
  window.open(`${ENGINES[engine.value].url}${encodeURIComponent(query.value.trim())}`, '_blank')
  query.value = ''
}
</script>

<style scoped>
.search-widget {
  width: 100%;
  max-width: 580px;
  margin: 0 auto;
}

.engine-selector {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.search-box {
  display: flex;
  align-items: center;
  position: relative;
}

.search-highlight {
  position: absolute;
  top: 0;
  left: 24px;
  right: 24px;
  pointer-events: none;
}

.search-icon {
  margin-left: 16px;
  flex-shrink: 0;
  transition: all 0.3s;
}

.search-input {
  flex: 1;
  padding: 16px;
  background: transparent;
  color: #fff;
  outline: none;
  border: none;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.search-submit-btn {
  margin-right: 8px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(180,140,255,0.20) 100%);
  border: 1px solid rgba(255,255,255,0.30);
  border-top: 1.5px solid rgba(255,255,255,0.45);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 12px rgba(120,80,255,0.25);
  backdrop-filter: blur(10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
