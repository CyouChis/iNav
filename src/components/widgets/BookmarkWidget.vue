<template>
  <div :class="containerClass">
    <div v-if="!isInGrid" class="glass-widget bookmark-widget-container">
      <div class="widget-highlight" />
      <BookmarkLinks />
      <button
        v-if="links.length > 0"
        @click="editing = !editing"
        class="edit-toggle"
      >
        {{ editing ? '完成' : '编辑' }}
      </button>
    </div>

    <div v-else class="grid-mode-container">
      <div
        v-if="isInGrid && links.length > 0"
        @click="collapsed = !collapsed"
        class="collapse-toggle"
      >
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="collapse-icon"
          :class="{ 'collapse-icon--rotated': collapsed }"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
        <span class="collapse-text">{{ collapsed ? '展开快捷导航' : '收起快捷导航' }}</span>
      </div>

      <Transition name="collapse">
        <div v-show="!collapsed" class="collapse-content">
          <BookmarkLinks />
        </div>
      </Transition>
    </div>

    <el-dialog
      v-model="showAdd"
      title="添加快捷方式"
      width="340px"
    >
      <el-form label-position="top" @submit.prevent="handleAddLink">
        <el-form-item label="网址">
          <el-input
            v-model="newLinkUrl"
            autofocus
            placeholder="https://example.com"
          />
        </el-form-item>
        <el-form-item label="名称（可选）">
          <el-input
            v-model="newLinkName"
            :placeholder="newLinkUrl ? getDomain(newLinkUrl) : '网站名称'"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAdd = false">取消</el-button>
        <el-button type="primary" @click="handleAddLink">添加</el-button>
      </template>
    </el-dialog>
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
  'widget-wrapper-grid': props.isInGrid,
  'widget-wrapper-default': !props.isInGrid,
}))

const collapsed = ref(false)

const BookmarkLinks = defineComponent({
  name: 'BookmarkLinks',
  setup() {
    return () => h('div', { class: 'links-container' }, [
      h('div', { class: 'links-grid' },
        links.value.map(link =>
          h('div', { key: link.id, class: 'link-item' }, [
            editing.value ? h('button', {
              onClick: () => removeLink(link.id),
              class: 'link-delete-btn'
            }, [
              h('svg', { width: 8, height: 8, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 }, [
                h('path', { d: 'M18 6 6 18' }),
                h('path', { d: 'm6 6 12 12' })
              ])
            ]) : null,
            h('a', {
              href: getDisplayUrl(link.url),
              target: '_blank',
              rel: 'noopener noreferrer',
              class: 'link-anchor',
              style: { width: '64px' },
              onClick: (e: Event) => { if (editing.value) e.preventDefault() }
            }, [
              h('div', { class: 'link-icon-wrapper' }, [
                link.url ? h('img', {
                  src: getFavicon(link.url),
                  alt: link.name,
                  class: 'link-favicon',
                  onError: (e: Event) => { (e.target as HTMLImageElement).style.display = 'none' }
                }) : h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, class: 'link-placeholder' }, [
                  h('circle', { cx: 12, cy: 12, r: 10 }),
                  h('line', { x1: 2, y1: 12, x2: 22, y2: 12 }),
                  h('path', { d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' })
                ])
              ]),
              h('span', { class: 'link-name', style: { fontSize: '10px' } }, link.name)
            ])
          ])
        )
      ),
      h('button', {
        onClick: () => { showAdd.value = true },
        class: 'link-add-btn',
        style: { width: '64px' }
      }, [
        h('div', { class: 'link-add-icon' }, [
          h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 }, [
            h('path', { d: 'M5 12h14' }),
            h('path', { d: 'M12 5v14' })
          ])
        ]),
        h('span', { class: 'link-add-text', style: { fontSize: '10px' } }, '添加')
      ])
    ])
  }
})

const DEFAULT_LINKS: QuickLink[] = defaultLinksData.quickLinks

const storedLinks = localStorage.getItem('quickLinks')
const links = ref<QuickLink[]>(storedLinks ? JSON.parse(storedLinks) : DEFAULT_LINKS)

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
.widget-wrapper-grid {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.widget-wrapper-default {
}

.bookmark-widget-container {
  position: relative;
}

.widget-highlight {
  position: absolute;
  top: 0;
  left: 32px;
  right: 32px;
  height: 1px;
  pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5) 40%, rgba(255,255,255,0.5) 60%, transparent);
}

.edit-toggle {
  position: absolute;
  top: -28px;
  right: 4px;
  color: rgba(255, 255, 255, 0.35);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 11px;
  transition: color 0.2s;
}

.edit-toggle:hover {
  color: rgba(255, 255, 255, 0.6);
}

.grid-mode-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.collapse-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 0;
  cursor: pointer;
  user-select: none;
}

.collapse-icon {
  color: rgba(255, 255, 255, 0.4);
  transition: transform 0.2s;
}

.collapse-icon--rotated {
  transform: rotate(180deg);
}

.collapse-text {
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
  transition: color 0.2s;
}

.collapse-toggle:hover .collapse-text {
  color: rgba(255, 255, 255, 0.6);
}

.collapse-content {
  flex: 1;
  overflow: auto;
}

.links-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 100%;
}

.links-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
}

.link-item {
  position: relative;
}

.link-delete-btn {
  position: absolute;
  top: -4px;
  right: -4px;
  z-index: 10;
  width: 16px;
  height: 16px;
  background: #ef4444;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.link-anchor {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 12px;
  transition: all 0.2s;
  text-decoration: none;
}

.link-anchor:hover {
  background: rgba(255, 255, 255, 0.05);
}

.link-anchor:hover .link-icon-wrapper {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.link-anchor:hover .link-name {
  color: rgba(255, 255, 255, 0.9);
}

.link-icon-wrapper {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  transition: all 0.2s;
  background: var(--glass-lightest);
}

.link-favicon {
  width: 20px;
  height: 20px;
}

.link-placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.link-name {
  color: rgba(255, 255, 255, 0.55);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  transition: color 0.2s;
}

.link-add-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 12px;
  transition: all 0.2s;
  background: none;
  border: none;
  cursor: pointer;
}

.link-add-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.link-add-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.25);
  transition: color 0.2s;
  background: var(--glass-subtle);
  border: 1px dashed var(--glass-border-dashed);
}

.link-add-btn:hover .link-add-icon {
  color: rgba(255, 255, 255, 0.5);
}

.link-add-text {
  color: rgba(255, 255, 255, 0.25);
}

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
