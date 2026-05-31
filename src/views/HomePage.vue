<template>
  <div class="home-page">
    <div class="home-content">
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

<style scoped>
.home-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 32px 16px;
  min-width: 0;
  overflow-y: auto;
}

.home-content {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
