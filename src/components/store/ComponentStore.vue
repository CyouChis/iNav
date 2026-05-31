<template>
  <div class="component-store">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-white">组件商店</h2>
      <button
        @click="$emit('close')"
        class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
    
    <p class="text-white/40 text-sm mb-6">
      拖拽组件到页面添加
    </p>
    
    <div class="space-y-6">
      <!-- 按分类分组 -->
      <div v-for="(group, groupName) in groupedComponents" :key="groupName">
        <h3 class="text-white/60 text-sm font-medium mb-3">{{ groupName }}</h3>
        <div class="grid grid-cols-2 gap-3">
          <ComponentCard
            v-for="comp in group"
            :key="comp.type"
            :component="comp"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { COMPONENT_LIBRARY } from './ComponentLibrary'
import ComponentCard from './ComponentCard.vue'

defineEmits<{
  close: []
}>()

const groupedComponents = computed(() => {
  const groups: Record<string, typeof COMPONENT_LIBRARY> = {}
  for (const comp of COMPONENT_LIBRARY) {
    const cat = comp.category || '其他'
    if (!groups[cat]) {
      groups[cat] = []
    }
    groups[cat].push(comp)
  }
  return groups
})
</script>

<style scoped>
.component-store {
  padding: 1.5rem;
}
</style>
