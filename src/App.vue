<template>
  <div class="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex">
    <el-aside :width="isCollapsed ? '64px' : '240px'" class="bg-slate-800/80 backdrop-blur-lg transition-all duration-300">
      <div class="h-full flex flex-col">
        <div class="p-4 flex items-center justify-between">
          <h1 v-if="!isCollapsed" class="text-xl font-bold text-white">iNav</h1>
          <el-button :icon="isCollapsed ? Expand : Fold" circle @click="isCollapsed = !isCollapsed" class="!bg-transparent !border-white/20 !text-white hover:!bg-white/10" />
        </div>
        <el-menu
          :default-active="activeCategory"
          :collapse="isCollapsed"
          :collapse-transition="false"
          class="flex-1 bg-transparent border-none"
          text-color="rgba(255,255,255,0.8)"
          active-text-color="#fff"
          @select="handleMenuSelect"
        >
          <el-menu-item index="dashboard">
            <el-icon><House /></el-icon>
            <template #title>仪表盘</template>
          </el-menu-item>
          <el-menu-item index="tools">
            <el-icon><Tools /></el-icon>
            <template #title>工具</template>
          </el-menu-item>
          <el-menu-item index="bookmarks">
            <el-icon><Document /></el-icon>
            <template #title>书签</template>
          </el-menu-item>
          <el-menu-item index="settings">
            <el-icon><Setting /></el-icon>
            <template #title>设置</template>
          </el-menu-item>
        </el-menu>
      </div>
    </el-aside>
    <el-main class="p-8 flex-1 overflow-auto">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-2xl font-bold text-white mb-8">{{ categoryTitle }}</h2>
        <div v-if="activeCategory === 'dashboard'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ClockWidget />
          <SearchWidget />
          <WeatherWidget />
          <BookmarkWidget />
        </div>
        <div v-else class="text-white/60 text-center py-20">
          <div class="text-5xl mb-4">{{ categoryIcon }}</div>
          <div class="text-xl">{{ categoryTitle }} 分类内容开发中...</div>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { House, Tools, Document, Setting, Expand, Fold } from '@element-plus/icons-vue'
import ClockWidget from './components/widgets/ClockWidget.vue'
import SearchWidget from './components/widgets/SearchWidget.vue'
import WeatherWidget from './components/widgets/WeatherWidget.vue'
import BookmarkWidget from './components/widgets/BookmarkWidget.vue'

const isCollapsed = ref(false)
const activeCategory = ref('dashboard')

const categoryInfo = {
  dashboard: { title: '仪表盘', icon: '🏠' },
  tools: { title: '工具', icon: '🔧' },
  bookmarks: { title: '书签', icon: '📑' },
  settings: { title: '设置', icon: '⚙️' }
}

const categoryTitle = computed(() => categoryInfo[activeCategory.value as keyof typeof categoryInfo]?.title || '')
const categoryIcon = computed(() => categoryInfo[activeCategory.value as keyof typeof categoryInfo]?.icon || '')

const handleMenuSelect = (index: string) => {
  activeCategory.value = index
}
</script>
