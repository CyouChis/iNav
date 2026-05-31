import { h } from 'vue'
import ClockWidget from '../widgets/ClockWidget.vue'
import SearchWidget from '../widgets/SearchWidget.vue'
import BookmarkWidget from '../widgets/BookmarkWidget.vue'

export interface ComponentDef {
  type: string
  name: string
  description: string
  icon: string
  defaultSize: { w: number; h: number }
  component: any
  category?: string
}

export const COMPONENT_LIBRARY: ComponentDef[] = [
  {
    type: 'clock',
    name: '时钟',
    description: '显示当前时间',
    icon: '🕐',
    defaultSize: { w: 4, h: 2 },
    component: ClockWidget,
    category: '基础',
  },
  {
    type: 'search',
    name: '搜索',
    description: '快速搜索框',
    icon: '🔍',
    defaultSize: { w: 8, h: 1 },
    component: SearchWidget,
    category: '基础',
  },
  {
    type: 'bookmark',
    name: '书签',
    description: '快速访问书签',
    icon: '🔖',
    defaultSize: { w: 8, h: 3 },
    component: BookmarkWidget,
    category: '基础',
  },
  {
    type: 'weather',
    name: '天气',
    description: '显示天气信息',
    icon: '🌤️',
    defaultSize: { w: 4, h: 2 },
    component: {
      name: 'WeatherWidget',
      setup() {
        return () => h('div', { class: 'w-full h-full flex items-center justify-center text-white' }, '🌤️ 天气组件')
      },
    },
    category: '实用',
  },
  {
    type: 'note',
    name: '便签',
    description: '记录便签',
    icon: '📝',
    defaultSize: { w: 4, h: 2 },
    component: {
      name: 'NoteWidget',
      setup() {
        return () => h('div', { class: 'w-full h-full flex items-center justify-center text-white' }, '📝 便签组件')
      },
    },
    category: '实用',
  },
  {
    type: 'shortcut',
    name: '快捷方式',
    description: '快速启动应用',
    icon: '⚡',
    defaultSize: { w: 2, h: 2 },
    component: {
      name: 'ShortcutWidget',
      setup() {
        return () => h('div', { class: 'w-full h-full flex items-center justify-center text-white' }, '⚡ 快捷方式')
      },
    },
    category: '实用',
  },
  {
    type: 'calendar',
    name: '日历',
    description: '显示日历',
    icon: '📅',
    defaultSize: { w: 4, h: 3 },
    component: {
      name: 'CalendarWidget',
      setup() {
        return () => h('div', { class: 'w-full h-full flex items-center justify-center text-white' }, '📅 日历组件')
      },
    },
    category: '实用',
  },
]

export const getComponentByType = (type: string) => {
  return COMPONENT_LIBRARY.find((c) => c.type === type)
}
