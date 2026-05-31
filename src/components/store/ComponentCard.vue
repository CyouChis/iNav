<template>
  <div
    class="component-card"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <div class="card-inner">
      <div class="card-content">
        <div class="card-icon">{{ component.icon }}</div>
        <div class="card-name">{{ component.name }}</div>
        <div class="card-desc">{{ component.description }}</div>
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
}
</script>

<style scoped>
.component-card {
  position: relative;
  cursor: grab;
  user-select: none;
}

.component-card:active {
  cursor: grabbing;
}

.card-inner {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s;
}

.card-inner:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
}

.card-icon {
  font-size: 30px;
}

.card-name {
  color: #fff;
  font-weight: 500;
  font-size: 14px;
}

.card-desc {
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
}
</style>
