<template>
  <div class="w-full h-screen flex overflow-hidden relative">
    <!-- Background -->
    <div
      class="absolute inset-0 transition-all duration-700"
      :style="bg.type === 'gradient' ? { background: bg.value } : { backgroundImage: `url(${bg.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }"
    />
    <div
      class="absolute inset-0"
      style="background: rgba(0,0,0,0.3)"
    />

    <!-- Left Sidebar -->
    <div class="relative z-10 h-full">
      <SidebarWidget
        v-model:categories="categories"
        v-model:collapsed="sidebarCollapsed"
      />
    </div>

    <!-- Main content with router view -->
    <div class="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
      <router-view 
        :categories="categories" 
        @update:categories="categories = $event"
        :edit-mode="showEditMode"
        @add-component="addComponent"
        @remove-component="removeComponent"
      />
    </div>

    <!-- Top-right controls (only on home page) -->
    <div v-if="isHomePage" class="absolute top-4 right-4 z-20 flex items-center gap-2">
      <button
        @click="showEditMode = !showEditMode"
        :class="{ 'bg-blue-600 text-white': showEditMode }"
        class="w-9 h-9 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all backdrop-blur-sm"
        style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1)"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
      <button
        @click="showComponentStore = true"
        class="w-9 h-9 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all backdrop-blur-sm"
        style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1)"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      </button>
      <button
        @click="showSettings = !showSettings"
        class="w-9 h-9 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all backdrop-blur-sm"
        style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1)"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>
    </div>

    <!-- Settings Panel -->
    <Transition name="fade">
      <div v-if="showSettings">
        <div
          class="fixed inset-0 z-30"
          @click="showSettings = false"
        />
        <div
          class="fixed top-14 right-4 z-40 rounded-2xl shadow-2xl p-5 w-[280px]"
          style="background: rgba(15,15,25,0.92); backdrop-filter: blur(30px); border: 1px solid rgba(255,255,255,0.12)"
        >
          <div class="flex items-center justify-between mb-4">
            <span class="text-white" style="font-size: 14px; font-weight: 600">背景设置</span>
            <button
              @click="showSettings = false"
              class="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 text-white/50 hover:text-white"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-4 gap-2">
            <div
              v-for="(background, index) in BACKGROUNDS"
              :key="index"
              class="relative rounded-xl overflow-hidden transition-all hover:scale-105 cursor-pointer"
              style="height: 52px"
              :style="{ outline: bgIndex === index ? '2px solid #6366f1' : '2px solid transparent', outlineOffset: '2px' }"
              @click="bgIndex = index"
            >
              <div
                class="absolute inset-0"
                :style="background.type === 'gradient' ? { background: background.value } : { backgroundImage: `url(${background.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }"
              />
              <div class="absolute bottom-0 inset-x-0 py-1 text-center text-white/70" style="font-size: 9px; background: rgba(0,0,0,0.4)">
                {{ background.label }}
              </div>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-white/10">
            <button
              @click="dashboard.resetDashboard"
              class="w-full py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm"
            >
              重置布局
            </button>
            <p class="text-white/40 mt-2" style="font-size: 11px">
              提示：右键点击侧边栏中的分类或书签可进行编辑操作
            </p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Component Store Panel -->
    <Transition name="fade">
      <div v-if="showComponentStore">
        <div
          class="fixed inset-0 z-30"
          @click="showComponentStore = false"
        />
        <div
          class="fixed top-14 right-4 z-40 rounded-2xl shadow-2xl w-[320px] max-h-[80vh] overflow-y-auto"
          style="background: rgba(15,15,25,0.92); backdrop-filter: blur(30px); border: 1px solid rgba(255,255,255,0.12)"
        >
          <ComponentStore @close="showComponentStore = false" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SidebarWidget, { type Category } from './components/widgets/SidebarWidget.vue'
import ComponentStore from './components/store/ComponentStore.vue'
import { useDashboardStore } from './stores/dashboard'
import configData from './config/links.json'

const DEFAULT_CATEGORIES: Category[] = configData.sidebarCategories
const BACKGROUNDS = configData.backgrounds

// Load from localStorage
const storedCategories = localStorage.getItem('inav-categories')
const storedBgIndex = localStorage.getItem('inav-bg')
const storedSidebarCollapsed = localStorage.getItem('inav-sidebar-collapsed')

const categories = ref<Category[]>(storedCategories ? JSON.parse(storedCategories) : DEFAULT_CATEGORIES)
const bgIndex = ref<number>(storedBgIndex ? parseInt(storedBgIndex) : 0)
const sidebarCollapsed = ref<boolean>(storedSidebarCollapsed ? JSON.parse(storedSidebarCollapsed) : false)
const showSettings = ref(false)
const showComponentStore = ref(false)
const showEditMode = ref(false)

const dashboard = useDashboardStore()
const route = useRoute()

const isHomePage = computed(() => route.path === '/')

onMounted(() => {
  dashboard.loadFromStorage()
  dashboard.initializeDefaults()
})

const bg = computed(() => BACKGROUNDS[bgIndex.value] || BACKGROUNDS[0])

const addComponent = (data: { type: string; x: number; y: number; w: number; h: number }) => {
  dashboard.addComponent(data.type, data.x, data.y, data.w, data.h)
}

const removeComponent = (id: string) => {
  dashboard.removeComponent(id)
}

// Save to localStorage
watch(categories, (newCategories) => {
  localStorage.setItem('inav-categories', JSON.stringify(newCategories))
}, { deep: true })

watch(bgIndex, (newIndex) => {
  localStorage.setItem('inav-bg', newIndex.toString())
})

watch(sidebarCollapsed, (newCollapsed) => {
  localStorage.setItem('inav-sidebar-collapsed', JSON.stringify(newCollapsed))
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
