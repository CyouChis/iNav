<template>
  <div class="flex-1 flex flex-col items-center justify-start py-8 px-4 min-w-0 overflow-y-auto">
    <div class="w-full max-w-[900px] flex flex-col items-center">
      <!-- 网格布局区域 -->
      <DashboardGrid
        :components="dashboard.components"
        :edit-mode="editMode"
        :extra-props="{ categories }"
        @add-component="emit('add-component', $event)"
        @remove-component="emit('remove-component', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStore } from '../stores/dashboard'
import DashboardGrid from '../components/dashboard/DashboardGrid.vue'
import type { Category } from '../components/widgets/SidebarWidget.vue'

interface Props {
  categories: Category[]
  editMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editMode: false,
})

const emit = defineEmits<{
  'add-component': [data: { type: string; x: number; y: number; w: number; h: number }]
  'remove-component': [id: string]
}>()

const dashboard = useDashboardStore()
</script>