<template>
  <div class="app-layout">
    <div
      class="bg-layer"
      :style="bg.type === 'gradient' ? { background: bg.value } : { backgroundImage: `url(${bg.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }"
    />
    <div class="bg-overlay" />

    <div class="sidebar-area">
      <SidebarWidget
        v-model:categories="categories"
        v-model:collapsed="sidebarCollapsed"
      />
    </div>

    <div class="main-area">
      <router-view
        :categories="categories"
        @update:categories="categories = $event"
        :edit-mode="showEditMode"
        @add-component="addComponent"
        @remove-component="removeComponent"
      />
    </div>

    <div v-if="isHomePage" class="top-controls">
      <el-button
        :type="showEditMode ? 'primary' : 'default'"
        circle
        size="small"
        @click="showEditMode = !showEditMode"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </el-button>
      <el-button
        circle
        size="small"
        @click="showComponentStore = true"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      </el-button>
      <el-button
        circle
        size="small"
        @click="showSettings = !showSettings"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </el-button>
    </div>

    <el-drawer
      v-model="showSettings"
      title="背景设置"
      direction="rtl"
      size="300px"
    >
      <el-row :gutter="8">
        <el-col
          v-for="(background, index) in BACKGROUNDS"
          :key="index"
          :span="6"
        >
          <div
            class="bg-option"
            :class="{ 'bg-option--active': bgIndex === index }"
            @click="bgIndex = index"
          >
            <div
              class="bg-option-preview"
              :style="background.type === 'gradient' ? { background: background.value } : { backgroundImage: `url(${background.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }"
            />
            <div class="bg-option-label">{{ background.label }}</div>
          </div>
        </el-col>
      </el-row>

      <el-divider />

      <el-button
        style="width: 100%"
        @click="dashboard.resetDashboard"
      >
        重置布局
      </el-button>
      <p class="settings-tip">提示：右键点击侧边栏中的分类或书签可进行编辑操作</p>
    </el-drawer>

    <el-drawer
      v-model="showComponentStore"
      title="组件商店"
      direction="rtl"
      size="340px"
    >
      <ComponentStore @close="showComponentStore = false" />
    </el-drawer>
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
.app-layout {
  width: 100%;
  height: 100vh;
  display: flex;
  overflow: hidden;
  position: relative;
}

.bg-layer {
  position: absolute;
  inset: 0;
  transition: all 0.7s;
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
}

.sidebar-area {
  position: relative;
  z-index: 10;
  height: 100%;
}

.main-area {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.top-controls {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 8px;
}

.bg-option {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  height: 52px;
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.bg-option:hover {
  transform: scale(1.05);
}

.bg-option--active {
  outline-color: #6366f1;
}

.bg-option-preview {
  position: absolute;
  inset: 0;
}

.bg-option-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 4px 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 9px;
  background: rgba(0, 0, 0, 0.4);
}

.settings-tip {
  color: rgba(255, 255, 255, 0.4);
  font-size: 11px;
  margin-top: 8px;
}
</style>
