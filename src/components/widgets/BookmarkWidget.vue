<template>
  <div :class="containerClass">
    <!-- Glass container wrapper (only when not in grid) -->
    <div
      v-if="!isInGrid"
      class="glass-widget relative"
    >
      <!-- Top highlight -->
      <div
        class="absolute top-0 left-8 right-8 pointer-events-none h-px bg-highlight-gradient"
      />

      <BookmarkLinks />

      <!-- Edit toggle -->
      <button
        v-if="links.length > 0"
        @click="editing = !editing"
        class="absolute -top-7 right-1 text-white/35 hover:text-white/60 transition-colors"
        style="font-size: 11px"
      >
        {{ editing ? '完成' : '编辑' }}
      </button>
    </div>

    <!-- Grid mode: collapsible content without glass styling -->
    <div v-else class="w-full h-full flex flex-col">
      <!-- Collapse toggle header -->
      <div 
        v-if="isInGrid && links.length > 0"
        @click="collapsed = !collapsed"
        class="flex items-center justify-center gap-2 py-2 cursor-pointer group select-none"
      >
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
          class="text-white/40 transition-transform duration-200"
          :class="{ 'rotate-180': collapsed }"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
        <span class="text-white/40 text-xs group-hover:text-white/60 transition-colors">
          {{ collapsed ? '展开快捷导航' : '收起快捷导航' }}
        </span>
      </div>

      <!-- Collapsible content -->
      <Transition name="collapse">
        <div v-show="!collapsed" class="flex-1 overflow-auto">
          <BookmarkLinks />
        </div>
      </Transition>
    </div>
    
    <!-- Add Link Modal -->
    <Transition name="modal">
      <div v-if="showAdd" class="fixed inset-0 z-50 flex items-center justify-center" @click.self="showAdd = false">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div
          class="relative rounded-2xl shadow-2xl p-6 w-[340px] bg-glass-overlay backdrop-blur-glass-heavy border border-glass-border border-t border-t-glass-border-top shadow-glass-dark"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 style="font-size: 15px; font-weight: 600" class="text-white">添加快捷方式</h3>
            <button
              @click="showAdd = false"
              class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 text-white/50"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <form @submit.prevent="handleAddLink" class="space-y-3">
            <div>
              <label style="font-size: 12px" class="block text-white/50 mb-1">网址</label>
              <input
                v-model="newLinkUrl"
                autofocus
                placeholder="https://example.com"
                class="w-full px-3 py-2.5 rounded-xl text-white outline-none placeholder:text-white/25 bg-glass-lightest border border-glass-border-light text-sm"
              />
            </div>
            <div>
              <label style="font-size: 12px" class="block text-white/50 mb-1">名称（可选）</label>
              <input
                v-model="newLinkName"
                :placeholder="newLinkUrl ? getDomain(newLinkUrl) : '网站名称'"
                class="w-full px-3 py-2.5 rounded-xl text-white outline-none placeholder:text-white/25 bg-glass-lightest border border-glass-border-light text-sm"
              />
            </div>
            <div class="flex gap-2 pt-1">
              <button
                type="button"
                @click="showAdd = false"
                class="flex-1 py-2.5 rounded-xl text-white/60 hover:bg-white/10 transition-colors"
                style="font-size: 14px; border: 1px solid rgba(255,255,255,0.12)"
              >
                取消
              </button>
              <button
                type="submit"
                class="flex-1 py-2.5 rounded-xl text-white transition-colors bg-accent-gradient-btn text-sm"
              >
                添加
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, defineComponent, h } from 'vue'
import defaultLinksData from '@/config/links.json'

export interface QuickLink {
  id: string
  name: string
  url: string
}

interface Props {
  isInGrid?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isInGrid: false,
})

const containerClass = computed(() => ({
  'w-full h-full flex items-center justify-center p-4': props.isInGrid,
}))

// Collapse state for grid mode
const collapsed = ref(false)

// Internal component for bookmark links to avoid duplication
const BookmarkLinks = defineComponent({
  name: 'BookmarkLinks',
  setup() {
    return () => h('div', { class: 'flex flex-wrap justify-center gap-1 w-full h-full' }, [
      // Links list
      h('div', { class: 'flex flex-wrap justify-center gap-1' }, 
        links.value.map(link => 
          h('div', { key: link.id, class: 'relative group' }, [
            // Delete button in edit mode
            editing.value ? h('button', {
              onClick: () => removeLink(link.id),
              class: 'absolute -top-1 -right-1 z-10 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg'
            }, [
              h('svg', { width: 8, height: 8, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 }, [
                h('path', { d: 'M18 6 6 18' }),
                h('path', { d: 'm6 6 12 12' })
              ])
            ]) : null,
            // Link anchor
            h('a', {
              href: getDisplayUrl(link.url),
              target: '_blank',
              rel: 'noopener noreferrer',
              class: 'flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-all group/link',
              style: { width: '64px' },
              onClick: (e: Event) => { if (editing.value) e.preventDefault() }
            }, [
              h('div', { class: 'w-8 h-8 flex items-center justify-center rounded-xl transition-all group-hover/link:scale-110 group-hover/link:shadow-lg bg-glass-lightest' }, [
                link.url ? h('img', {
                  src: getFavicon(link.url),
                  alt: link.name,
                  class: 'w-5 h-5',
                  onError: (e: Event) => { (e.target as HTMLImageElement).style.display = 'none' }
                }) : h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, class: 'text-white/50' }, [
                  h('circle', { cx: 12, cy: 12, r: 10 }),
                  h('line', { x1: 2, y1: 12, x2: 22, y2: 12 }),
                  h('path', { d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' })
                ])
              ]),
              h('span', { class: 'text-white/55 text-center truncate w-full group-hover/link:text-white/90 transition-colors', style: { fontSize: '10px' } }, link.name)
            ])
          ])
        )
      ),
      // Add button
      h('button', {
        onClick: () => { showAdd.value = true },
        class: 'flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-all hover:bg-white/8',
        style: { width: '64px' }
      }, [
        h('div', { class: 'w-8 h-8 flex items-center justify-center rounded-xl text-white/25 hover:text-white/50 transition-colors bg-glass-subtle border border-dashed border-glass-border-dashed' }, [
          h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 }, [
            h('path', { d: 'M5 12h14' }),
            h('path', { d: 'M12 5v14' })
          ])
        ]),
        h('span', { class: 'text-white/25', style: { fontSize: '10px' } }, '添加')
      ])
    ])
  }
})

const DEFAULT_LINKS: QuickLink[] = defaultLinksData.quickLinks

// Load from localStorage or use defaults
const storedLinks = localStorage.getItem('quickLinks')
const links = ref<QuickLink[]>(storedLinks ? JSON.parse(storedLinks) : DEFAULT_LINKS)

// Save to localStorage whenever links change
watch(links, (newLinks) => {
  localStorage.setItem('quickLinks', JSON.stringify(newLinks))
}, { deep: true })

const showAdd = ref(false)
const editing = ref(false)
const newLinkName = ref('')
const newLinkUrl = ref('')

function getFavicon(url: string): string {
  try {
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
  } catch {
    return ''
  }
}

function getDisplayUrl(url: string): string {
  if (!url.startsWith('http')) return `https://${url}`
  return url
}

function getDomain(url: string): string {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`)
    return u.hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function addLink(data: { name: string; url: string }) {
  links.value.push({
    id: crypto.randomUUID(),
    ...data,
  })
}

function removeLink(id: string) {
  const index = links.value.findIndex(l => l.id === id)
  if (index !== -1) {
    links.value.splice(index, 1)
  }
}

function handleAddLink() {
  if (!newLinkUrl.value.trim()) return
  addLink({
    name: newLinkName.value.trim() || getDomain(newLinkUrl.value),
    url: newLinkUrl.value.trim(),
  })
  showAdd.value = false
  newLinkName.value = ''
  newLinkUrl.value = ''
}
</script>

<style scoped>
.bg-accent-gradient {
  background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(180,140,255,0.06) 100%);
}

.bg-highlight-gradient {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5) 40%, rgba(255,255,255,0.5) 60%, transparent);
}

.bg-glass-overlay {
  background: rgba(30,20,60,0.85);
}

.bg-accent-gradient-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
}

@supports not (backdrop-filter: blur(30px)) {
  .backdrop-blur-glass,
  .backdrop-blur-glass-heavy {
    background: rgba(20, 15, 40, 0.9);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  opacity: 0;
  transform: scale(0.95);
}

/* Collapse animation */
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}
.collapse-enter-to,
.collapse-leave-from {
  opacity: 1;
  max-height: 400px;
  transform: translateY(0);
}
</style>