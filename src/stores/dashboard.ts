import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface GridComponent {
  id: string
  type: string
  x: number
  y: number
  w: number
  h: number
  config?: Record<string, any>
}

export const useDashboardStore = defineStore('dashboard', () => {
  const components = ref<GridComponent[]>([])
  const gridColumns = 12
  const cellSize = 80
  const gap = 16
  
  // Reset dashboard to default
  const resetDashboard = () => {
    components.value = [
      {
        id: 'default-clock',
        type: 'clock',
        x: 3,
        y: 0,
        w: 6,
        h: 2,
      },
      {
        id: 'default-search',
        type: 'search',
        x: 1,
        y: 3,
        w: 10,
        h: 2,
      },
      {
        id: 'default-bookmarks',
        type: 'bookmark',
        x: 0,
        y: 5,
        w: 12,
        h: 4,
      },
    ]
    localStorage.setItem('inav-dashboard', JSON.stringify(components.value))
  }
  
  // Load from localStorage
  const loadFromStorage = () => {
    const stored = localStorage.getItem('inav-dashboard')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        // Validate the data
        if (Array.isArray(data) && data.every(item => 
          item.id && 
          item.type && 
          typeof item.x === 'number' && 
          typeof item.y === 'number' && 
          typeof item.w === 'number' && 
          typeof item.h === 'number'
        )) {
          components.value = data
        } else {
          // Invalid data, reset to default
          resetDashboard()
        }
      } catch (e) {
        console.error('Failed to load dashboard:', e)
        resetDashboard()
      }
    }
  }
  
  // Initialize with default components if empty
  const initializeDefaults = () => {
    if (components.value.length === 0) {
      resetDashboard()
    }
  }
  
  // Save to localStorage
  watch(
    components,
    (newComponents) => {
      localStorage.setItem('inav-dashboard', JSON.stringify(newComponents))
    },
    { deep: true }
  )
  
  const addComponent = (type: string, x: number, y: number, w: number, h: number) => {
    const newComponent: GridComponent = {
      id: `${type}-${Date.now()}`,
      type,
      x,
      y,
      w,
      h,
    }
    components.value.push(newComponent)
  }
  
  const removeComponent = (id: string) => {
    components.value = components.value.filter((c) => c.id !== id)
  }
  
  const updateComponent = (id: string, updates: Partial<GridComponent>) => {
    const component = components.value.find((c) => c.id === id)
    if (component) {
      Object.assign(component, updates)
    }
  }
  
  const checkCollision = (x: number, y: number, w: number, h: number, excludeId?: string): boolean => {
    return components.value.some((c) => {
      if (excludeId && c.id === excludeId) return false
      return (
        x < c.x + c.w &&
        x + w > c.x &&
        y < c.y + c.h &&
        y + h > c.y
      )
    })
  }
  
  return {
    components,
    gridColumns,
    cellSize,
    gap,
    loadFromStorage,
    initializeDefaults,
    resetDashboard,
    addComponent,
    removeComponent,
    updateComponent,
    checkCollision,
  }
})
