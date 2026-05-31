<template>
  <div class="component-store">
    <div class="store-header">
      <h2 class="store-title">组件商店</h2>
      <el-button text circle @click="$emit('close')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </el-button>
    </div>

    <p class="store-desc">拖拽组件到页面添加</p>

    <div class="store-groups">
      <div v-for="(group, groupName) in groupedComponents" :key="groupName">
        <h3 class="group-title">{{ groupName }}</h3>
        <el-row :gutter="12">
          <el-col
            v-for="comp in group"
            :key="comp.type"
            :span="12"
          >
            <ComponentCard :component="comp" />
          </el-col>
        </el-row>
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
  padding: 24px;
}

.store-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.store-title {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}

.store-desc {
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
  margin-bottom: 24px;
}

.store-groups {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.group-title {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
}
</style>
