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

    <!-- Main content -->
    <div class="relative z-10 flex-1 flex flex-col items-center justify-center gap-10 px-8 min-w-0">
      <!-- Clock -->
      <ClockWidget />

      <!-- Search bar -->
      <div class="w-full max-w-[600px]">
        <SearchWidget />
      </div>

      <!-- Quick links -->
      <div class="relative w-full max-w-[700px]">
        <BookmarkWidget />
      </div>
    </div>

    <!-- Top-right controls -->
    <div class="absolute top-4 right-4 z-20 flex items-center gap-2">
      <button
        @click="showSettings = !showSettings"
        class="w-9 h-9 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all backdrop-blur-sm"
        style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1)"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
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
            <p class="text-white/40" style="font-size: 11px">
              提示：右键点击侧边栏中的分类或书签可进行编辑操作
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SidebarWidget, { type Category } from './components/widgets/SidebarWidget.vue'
import ClockWidget from './components/widgets/ClockWidget.vue'
import SearchWidget from './components/widgets/SearchWidget.vue'
import BookmarkWidget from './components/widgets/BookmarkWidget.vue'
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

const bg = computed(() => BACKGROUNDS[bgIndex.value] || BACKGROUNDS[0])

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
