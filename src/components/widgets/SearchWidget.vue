<template>
  <div class="search-widget">
    <div class="search-container">
      <div class="search-box">
        <el-popover
          v-model:visible="showEnginePopover"
          placement="bottom-start"
          trigger="manual"
          :width="480"
          :hide-after="0"
        >
          <template #reference>
            <div class="engine-selector" @click="showEnginePopover = !showEnginePopover">
              <div class="engine-icon" :style="{ color: currentEngine.color }">
                <GoogleIcon v-if="currentEngine.name === 'Google'" height="1em" />
                <BingIcon v-else-if="currentEngine.name === 'Bing'" height="1em" />
                <BaiduFillIcon v-else height="1em" />
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </template>
          
          <div class="engine-popover">
            <div class="engine-quick-bar">
              <div
                v-for="(e, i) in engines"
                :key="i"
                class="engine-quick-item"
                :class="{ 'engine-quick-item--active': engine === i }"
                @click="selectEngine(i)"
              >
                <div class="engine-quick-icon" :style="{ color: e.color }">
                  <GoogleIcon v-if="e.name === 'Google'" height="1.5em" />
                  <BingIcon v-else-if="e.name === 'Bing'" height="1.5em" />
                  <BaiduFillIcon v-else height="1.5em" />
                </div>
                <span class="engine-quick-name">{{ e.name }}</span>
              </div>
              
              <div class="engine-quick-item engine-quick-add" @click="showAddDialog = true">
                <div class="engine-quick-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                  </svg>
                </div>
                <span class="engine-quick-name">添加</span>
              </div>
            </div>

            <el-divider />
            
            <div class="engine-list">
              <div
                v-for="(e, i) in engines"
                :key="i"
                class="engine-item"
                :class="{ 'engine-item--active': engine === i }"
                @click="selectEngine(i)"
              >
                <div class="engine-item-icon" :style="{ color: e.color }">
                  <GoogleIcon v-if="e.name === 'Google'" height="1.25em" />
                  <BingIcon v-else-if="e.name === 'Bing'" height="1.25em" />
                  <BaiduFillIcon v-else height="1.25em" />
                </div>
                <span class="engine-item-name">{{ e.name }}</span>
                <el-button
                  v-if="engines.length > 1"
                  text
                  size="small"
                  class="engine-item-delete"
                  @click.stop="removeEngine(i)"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </el-button>
              </div>
            </div>
            
            <div class="engine-add">
              <el-button text @click="showAddDialog = true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                添加搜索引擎
              </el-button>
            </div>
          </div>
        </el-popover>

        <input
          ref="inputRef"
          v-model="query"
          @focus="focused = true"
          @blur="handleBlur"
          @keydown.tab.prevent="cycleEngine"
          :placeholder="`输入搜索内容`"
          class="search-input"
        />
        
        <el-button
          type="primary"
          circle
          class="search-submit-btn"
          @click="handleSearch"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </el-button>
      </div>
    </div>

    <el-dialog v-model="showAddDialog" title="添加搜索引擎" width="400px">
      <el-form :model="newEngine" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="newEngine.name" placeholder="例如：Google" />
        </el-form-item>
        <el-form-item label="搜索 URL">
          <el-input v-model="newEngine.url" placeholder="例如：https://www.google.com/search?q=" />
        </el-form-item>
        <el-form-item label="颜色">
          <el-color-picker v-model="newEngine.color" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addEngine">添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaiduFillIcon from '@iconify-vue/ri/baidu-fill'
import GoogleIcon from '@iconify-vue/material-icon-theme/google'
import BingIcon from '@iconify-vue/logos/bing'

interface Engine {
  name: string
  url: string
  color: string
}

const engines = ref<Engine[]>([
  { name: '百度', url: 'https://www.baidu.com/s?wd=', color: '#2932E1' },
  { name: 'Google', url: 'https://www.google.com/search?q=', color: '#4285F4' },
  { name: 'Bing', url: 'https://www.bing.com/search?q=', color: '#00A4EF' },
])

const query = ref('')
const engine = ref(0)
const focused = ref(false)
const showEnginePopover = ref(false)
const showAddDialog = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const newEngine = ref({
  name: '',
  url: '',
  color: '#4285F4',
})

const currentEngine = computed(() => engines.value[engine.value])

function selectEngine(index: number) {
  engine.value = index
  showEnginePopover.value = false
}

function removeEngine(index: number) {
  if (engines.value.length <= 1) return
  engines.value.splice(index, 1)
  if (engine.value >= engines.value.length) {
    engine.value = engines.value.length - 1
  }
}

function addEngine() {
  if (!newEngine.value.name || !newEngine.value.url) return
  engines.value.push({
    name: newEngine.value.name,
    url: newEngine.value.url,
    color: newEngine.value.color,
  })
  newEngine.value = { name: '', url: '', color: '#4285F4' }
  showAddDialog.value = false
}

function cycleEngine() {
  engine.value = (engine.value + 1) % engines.value.length
}

function handleSearch() {
  if (!query.value.trim()) return
  window.open(`${engines.value[engine.value].url}${encodeURIComponent(query.value.trim())}`, '_blank')
  query.value = ''
}

function handleBlur() {
  setTimeout(() => {
    focused.value = false
  }, 200)
}
</script>

<style scoped>
.search-widget {
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
}

.search-container {
  margin-bottom: 16px;
}

.search-box {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 4px;
  backdrop-filter: blur(10px);
}

.engine-selector {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 20px;
  transition: background 0.2s;
}

.engine-selector:hover {
  background: rgba(255, 255, 255, 0.1);
}

.engine-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  background: transparent;
  color: #fff;
  outline: none;
  border: none;
  font-size: 15px;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.search-submit-btn {
  flex-shrink: 0;
}

.engine-popover {
  padding: 8px 0;
}

.engine-list {
  max-height: 240px;
  overflow-y: auto;
}

.engine-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.engine-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.engine-item--active {
  background: rgba(255, 255, 255, 0.12);
}

.engine-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
}

.engine-item-name {
  flex: 1;
  font-size: 14px;
}

.engine-item-delete {
  opacity: 0;
  transition: opacity 0.2s;
}

.engine-item:hover .engine-item-delete {
  opacity: 1;
}

.engine-add {
  padding: 8px 12px;
}

.engine-quick-bar {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 12px;
  flex-wrap: wrap;
}

.engine-quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.engine-quick-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.engine-quick-item--active {
  background: rgba(255, 255, 255, 0.15);
}

.engine-quick-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
}

.engine-quick-name {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.engine-quick-add .engine-quick-icon {
  background: rgba(255, 255, 255, 0.06);
  border: 1px dashed rgba(255, 255, 255, 0.2);
}
</style>
