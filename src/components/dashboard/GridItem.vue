<template>
  <div
    class="grid-item relative group"
    :style="gridStyle"
    :class="{ 'is-dragging': isDragging, 'is-editing': editMode }"
    @mousedown="handleMouseDown"
    @contextmenu.prevent="handleContextMenu"
  >
    <div class="w-full h-full rounded-xl overflow-hidden transition-all">
      <component 
        :is="componentDef?.component" 
        v-bind="{ ...extraProps, isInGrid: true }" 
      />
    </div>
    
    <!-- 编辑模式下的删除按钮 -->
    <div
      v-if="editMode"
      class="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
    >
      <button
        @click.stop="handleRemove"
        class="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, ref as shallowRef } from 'vue'
import { useDashboardStore, type GridComponent } from '../../stores/dashboard'
import { getComponentByType, type ComponentDef } from '../store/ComponentLibrary'

interface Props {
  component: GridComponent
  editMode?: boolean
  extraProps?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  editMode: false,
  extraProps: () => ({}),
})

const emit = defineEmits<{
  remove: [id: string]
}>()

const dashboard = useDashboardStore()
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

const componentDef = computed(() => getComponentByType(props.component.type))

const gridStyle = computed(() => {
  const left = props.component.x * (dashboard.cellSize + dashboard.gap)
  const top = props.component.y * (dashboard.cellSize + dashboard.gap)
  const width = props.component.w * (dashboard.cellSize + dashboard.gap) - dashboard.gap
  const height = props.component.h * (dashboard.cellSize + dashboard.gap) - dashboard.gap
  
  return {
    position: 'absolute' as const,
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
    transition: isDragging.value ? 'none' : 'all 0.2s ease',
  }
})

const handleMouseDown = (e: MouseEvent) => {
  if (!props.editMode) return
  
  isDragging.value = true
  const startX = e.clientX
  const startY = e.clientY
  const startGridX = props.component.x
  const startGridY = props.component.y
  
  const handleMouseMove = (moveEvent: MouseEvent) => {
    const dx = moveEvent.clientX - startX
    const dy = moveEvent.clientY - startY
    
    const cellTotal = dashboard.cellSize + dashboard.gap
    
    const newX = startGridX + Math.round(dx / cellTotal)
    const newY = startGridY + Math.round(dy / cellTotal)
    
    // 确保不超出边界
    const boundedX = Math.max(0, Math.min(newX, dashboard.gridColumns - props.component.w))
    const boundedY = Math.max(0, newY)
    
    dashboard.updateComponent(props.component.id, {
      x: boundedX,
      y: boundedY,
    })
  }
  
  const handleMouseUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const handleRemove = () => {
  emit('remove', props.component.id)
}

const handleContextMenu = (e: MouseEvent) => {
  if (!props.editMode) return
  e.preventDefault()
  emit('remove', props.component.id)
}
</script>

<style scoped>
.grid-item {
  z-index: 2;
}
.grid-item.is-dragging {
  z-index: 100;
}
.grid-item.is-dragging > div {
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  border-color: rgba(99, 102, 241, 0.5);
}
.grid-item.is-editing {
  cursor: grab;
}
.grid-item.is-editing:active {
  cursor: grabbing;
}
</style>
