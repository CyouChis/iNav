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
import { ref, computed, watch, onMounted } from 'vue'
import SidebarWidget, { type Category } from './components/widgets/SidebarWidget.vue'
import ClockWidget from './components/widgets/ClockWidget.vue'
import SearchWidget from './components/widgets/SearchWidget.vue'
import BookmarkWidget from './components/widgets/BookmarkWidget.vue'

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: '1',
    name: '常用工具',
    color: '#6366f1',
    expanded: true,
    bookmarks: [
      { id: '11', name: 'ChatGPT', url: 'https://chatgpt.com' },
      { id: '12', name: 'Claude', url: 'https://claude.ai' },
      { id: '13', name: 'Notion', url: 'https://notion.so' },
    ],
  },
  {
    id: '2',
    name: '开发资源',
    color: '#22c55e',
    expanded: true,
    bookmarks: [
      { id: '21', name: 'GitHub', url: 'https://github.com' },
      { id: '22', name: 'Stack Overflow', url: 'https://stackoverflow.com' },
      { id: '23', name: 'MDN Docs', url: 'https://developer.mozilla.org' },
      { id: '24', name: 'npm', url: 'https://npmjs.com' },
    ],
  },
  {
    id: '3',
    name: '设计灵感',
    color: '#ec4899',
    expanded: false,
    bookmarks: [
      { id: '31', name: 'Figma', url: 'https://figma.com' },
      { id: '32', name: 'Dribbble', url: 'https://dribbble.com' },
      { id: '33', name: 'Behance', url: 'https://behance.net' },
    ],
  },
  {
    id: '4',
    name: '社交媒体',
    color: '#f97316',
    expanded: false,
    bookmarks: [
      { id: '41', name: '微博', url: 'https://weibo.com' },
      { id: '42', name: 'Twitter', url: 'https://twitter.com' },
      { id: '43', name: 'LinkedIn', url: 'https://linkedin.com' },
    ],
  },
]

const BACKGROUNDS = [
  {
    type: 'gradient' as const,
    value: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
    label: '深蓝',
  },
  {
    type: 'gradient' as const,
    value: 'linear-gradient(135deg, #0d0d0d 0%, #1a0533 40%, #300a4f 100%)',
    label: '紫夜',
  },
  {
    type: 'gradient' as const,
    value: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%)',
    label: '暗黑',
  },
  {
    type: 'gradient' as const,
    value: 'linear-gradient(135deg, #062c1a 0%, #0a3d2e 40%, #0d4f3c 100%)',
    label: '墨绿',
  },
  {
    type: 'image' as const,
    value: 'https://images.unsplash.com/photo-1614851099511-773084f6911d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
    label: '渐变1',
  },
  {
    type: 'image' as const,
    value: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
    label: '渐变2',
  },
  {
    type: 'image' as const,
    value: 'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
    label: '渐变3',
  },
]

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
