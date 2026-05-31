<template>
  <div
    class="dashboard-grid"
    @dragover.prevent="handleDragOver"
    @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <div
      v-if="editMode"
      v-for="i in totalCells"
      :key="i"
      class="grid-cell"
      :style="getCellStyle(i - 1)"
    ></div>

    <div
      v-if="dropPreview"
      class="drop-preview"
      :style="dropPreview.style"
    ></div>

    <GridItem
      v-for="comp in components"
      :key="comp.id"
      :component="comp"
      :edit-mode="editMode"
      :extra-props="extraProps"
      @remove="removeComponent"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDashboardStore, type GridComponent } from '../../stores/dashboard'
import GridItem from './GridItem.vue'

interface Props {
  components: GridComponent[]
  editMode?: boolean
  extraProps?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  editMode: false,
  extraProps: () => ({}),
})

const dashboard = useDashboardStore()

const dropPreview = ref<{
  x: number
  y: number
  w: number
  h: number
  style: Record<string, string>
} | null>(null)

const dropData = ref<{ type: string; w: number; h: number } | null>(null)

const totalCells = computed(() => {
  const maxY = Math.max(
    ...props.components.map((c) => c.y + c.h),
    8,
  )
  return dashboard.gridColumns * maxY
})

const getCellStyle = (index: number) => {
  const x = index % dashboard.gridColumns
  const y = Math.floor(index / dashboard.gridColumns)
  const left = x * (dashboard.cellSize + dashboard.gap)
  const top = y * (dashboard.cellSize + dashboard.gap)

  return {
    position: 'absolute' as const,
    left: `${left}px`,
    top: `${top}px`,
    width: `${dashboard.cellSize}px`,
    height: `${dashboard.cellSize}px`,
    borderRadius: '8px',
    border: '1px dashed rgba(255,255,255,0.1)',
    pointerEvents: 'none' as const,
    zIndex: '1',
  }
}

const handleDragOver = (e: DragEvent) => {
  if (!dropData.value) return

  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'copy'
  }

  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const cellTotal = dashboard.cellSize + dashboard.gap
  const gridX = Math.floor(x / cellTotal)
  const gridY = Math.floor(y / cellTotal)

  const boundedX = Math.max(0, Math.min(gridX, dashboard.gridColumns - dropData.value.w))
  const boundedY = Math.max(0, gridY)

  const previewLeft = boundedX * cellTotal
  const previewTop = boundedY * cellTotal
  const previewWidth = dropData.value.w * cellTotal - dashboard.gap
  const previewHeight = dropData.value.h * cellTotal - dashboard.gap

  dropPreview.value = {
    x: boundedX,
    y: boundedY,
    w: dropData.value.w,
    h: dropData.value.h,
    style: {
      position: 'absolute',
      left: `${previewLeft}px`,
      top: `${previewTop}px`,
      width: `${previewWidth}px`,
      height: `${previewHeight}px`,
      borderRadius: '12px',
      border: '2px dashed #6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      pointerEvents: 'none',
      zIndex: '50',
    },
  }
}

const handleDragEnter = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()

  const data = e.dataTransfer?.getData('text/plain')
  if (data) {
    try {
      dropData.value = JSON.parse(data)
    } catch {
      dropData.value = null
    }
  }
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()

  const relatedTarget = e.relatedTarget as HTMLElement | null
  if (relatedTarget && !(e.currentTarget as HTMLElement).contains(relatedTarget)) {
    dropPreview.value = null
    dropData.value = null
  }
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()

  if (!dropPreview.value || !dropData.value) {
    dropPreview.value = null
    dropData.value = null
    return
  }

  const hasCollision = props.components.some((c) => {
    return (
      dropPreview.value!.x < c.x + c.w &&
      dropPreview.value!.x + dropPreview.value!.w > c.x &&
      dropPreview.value!.y < c.y + c.h &&
      dropPreview.value!.y + dropPreview.value!.h > c.y
    )
  })

  if (!hasCollision) {
    emit('addComponent', {
      type: dropData.value.type,
      x: dropPreview.value.x,
      y: dropPreview.value.y,
      w: dropData.value.w,
      h: dropData.value.h,
    })
  }

  dropPreview.value = null
  dropData.value = null
}

const removeComponent = (id: string) => {
  emit('removeComponent', id)
}

const emit = defineEmits<{
  addComponent: [data: { type: string; x: number; y: number; w: number; h: number }]
  removeComponent: [id: string]
}>()
</script>

<style scoped>
.dashboard-grid {
  position: relative;
  width: 100%;
  min-height: 800px;
  padding-bottom: 100px;
}
</style>
