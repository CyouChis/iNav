<template>
  <div
    class="component-card group relative cursor-grab active:cursor-grabbing"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <div
      class="w-full h-full rounded-xl p-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
    >
      <div class="flex flex-col items-center text-center gap-2">
        <div class="text-3xl">{{ component.icon }}</div>
        <div class="text-white font-medium text-sm">{{ component.name }}</div>
        <div class="text-white/40 text-xs">{{ component.description }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ComponentDef } from './ComponentLibrary'

interface Props {
  component: ComponentDef
}

const props = defineProps<Props>()

const handleDragStart = (e: DragEvent) => {
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'copyMove'
    e.dataTransfer.dropEffect = 'copy'
    e.dataTransfer.setData('text/plain', JSON.stringify({
      type: props.component.type,
      w: props.component.defaultSize.w,
      h: props.component.defaultSize.h,
    }))
  }
}

const handleDragEnd = () => {
  // Cleanup if needed
}
</script>

<style scoped>
.component-card {
  user-select: none;
}
</style>
