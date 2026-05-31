<template>
  <div class="sidebar-root">
    <div
      class="sidebar-container"
      :class="collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'"
    >
      <div class="sidebar-header">
        <span v-if="!collapsed" class="sidebar-title">我的书签</span>
        <el-button text circle @click="$emit('update:collapsed', !collapsed)" class="collapse-btn">
          <svg
            v-if="collapsed"
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
          <svg
            v-else
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </el-button>
      </div>

      <div class="sidebar-categories">
        <div v-for="cat in categories" :key="cat.id">
          <div
            class="category-item"
            :class="{ 'category-item--active': isActiveCategory(cat.id) }"
            @click="handleCategoryClick(cat.id)"
            @contextmenu.prevent="handleContextMenu($event, 'category', cat.id)"
          >
            <div
              class="category-icon"
              :class="{ 'category-icon--active': isActiveCategory(cat.id) }"
              :style="{ backgroundColor: cat.color + (isActiveCategory(cat.id) ? '44' : '22'), color: isActiveCategory(cat.id) ? cat.color : cat.color + 'cc' }"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <template v-if="!collapsed">
              <span
                class="category-name"
                :class="{ 'category-name--active': isActiveCategory(cat.id) }"
              >
                {{ cat.name }}
              </span>
              <svg
                v-if="isActiveCategory(cat.id)"
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                class="category-arrow"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
              <div v-else class="category-hover-actions">
                <el-button
                  text
                  size="small"
                  circle
                  @click.stop="openAddBookmarkModal(cat.id)"
                  title="添加书签"
                  class="hover-action-btn"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                </el-button>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div class="sidebar-footer">
        <el-button
          v-if="!collapsed"
          class="add-category-btn"
          @click="openAddCategoryModal()"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          添加分类
        </el-button>
        <el-button
          v-else
          circle
          @click="handleCollapsedAddCategory"
          class="add-category-btn-collapsed"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </el-button>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="contextMenu"
          class="context-menu"
          :style="{
            left: contextMenu.x + 'px',
            top: contextMenu.y + 'px',
          }"
          @click.stop
        >
          <template v-if="contextMenu.type === 'category'">
            <div class="context-menu-item" @click="openAddBookmarkModal(contextMenu.categoryId); contextMenu = null">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              添加书签
            </div>
            <div class="context-menu-item" @click="openEditCategoryModal(contextMenu.categoryId); contextMenu = null">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
              编辑分类
            </div>
            <div class="context-menu-divider" />
            <div class="context-menu-item context-menu-item--danger" @click="deleteCategory(contextMenu.categoryId); contextMenu = null">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              删除分类
            </div>
          </template>
          <template v-else-if="contextMenu.type === 'bookmark' && contextMenu.bookmarkId">
            <div class="context-menu-item" @click="openEditBookmarkModal(contextMenu.categoryId, contextMenu.bookmarkId!); contextMenu = null">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
              编辑书签
            </div>
            <div class="context-menu-divider" />
            <div class="context-menu-item context-menu-item--danger" @click="deleteBookmark(contextMenu.categoryId, contextMenu.bookmarkId!); contextMenu = null">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              删除书签
            </div>
          </template>
        </div>
      </Transition>
    </Teleport>

    <el-dialog
      v-model="showModal"
      :title="modalInitial ? (modalType === 'category' ? '编辑分类' : '编辑书签') : (modalType === 'category' ? '添加分类' : '添加书签')"
      width="360px"
    >
      <el-form label-position="top" @submit.prevent="handleModalSubmit">
        <el-form-item label="名称">
          <el-input
            ref="modalNameInput"
            v-model="modalName"
            :placeholder="modalType === 'category' ? '分类名称' : '书签名称'"
          />
        </el-form-item>
        <el-form-item v-if="modalType === 'bookmark'" label="网址">
          <el-input
            v-model="modalUrl"
            placeholder="https://example.com"
          />
        </el-form-item>
        <el-form-item v-if="modalType === 'category'" label="颜色">
          <div class="color-picker-grid">
            <button
              v-for="color in COLORS"
              :key="color"
              type="button"
              class="color-swatch"
              :class="{ 'color-swatch--active': modalColor === color }"
              :style="{ backgroundColor: color }"
              @click="modalColor = color"
            >
              <svg
                v-if="modalColor === color"
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="check-icon"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showModal = false">取消</el-button>
        <el-button
          type="primary"
          :style="{ backgroundColor: modalType === 'category' ? modalColor : '#6366f1', borderColor: modalType === 'category' ? modalColor : '#6366f1' }"
          @click="handleModalSubmit"
        >
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export interface Bookmark {
  id: string
  name: string
  url: string
}

export interface Category {
  id: string
  name: string
  color: string
  expanded: boolean
  bookmarks: Bookmark[]
}

const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#14b8a6',
]

interface Props {
  categories: Category[]
  collapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
})

const emit = defineEmits<{
  'update:categories': [value: Category[]]
  'update:collapsed': [value: boolean]
}>()

const router = useRouter()
const route = useRoute()

function handleCategoryClick(id: string) {
  if (!props.collapsed) {
    router.push(`/category/${id}`)
  }
}

function isActiveCategory(id: string): boolean {
  return route.params.categoryId === id
}

const showModal = ref(false)
const modalType = ref<'category' | 'bookmark'>('category')
const modalCategoryId = ref<string | null>(null)
const modalInitial = ref<{ name: string; url?: string; color?: string } | null>(null)
const modalName = ref('')
const modalUrl = ref('')
const modalColor = ref(COLORS[0])
const modalNameInput = ref<HTMLInputElement | null>(null)

const contextMenu = ref<{
  x: number
  y: number
  type: 'category' | 'bookmark'
  categoryId: string
  bookmarkId?: string
} | null>(null)

function getFavicon(url: string): string {
  try {
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
  } catch {
    return ''
  }
}

function getDisplayUrl(url: string): string {
  if (!url.startsWith('http')) return `https://${url}`
  return url
}

function toggleCategory(id: string) {
  const newCategories = props.categories.map(cat =>
    cat.id === id ? { ...cat, expanded: !cat.expanded } : cat
  )
  emit('update:categories', newCategories)
}

function addCategory(data: { name: string; color?: string }) {
  const newCategory: Category = {
    id: crypto.randomUUID(),
    name: data.name,
    color: data.color || COLORS[0],
    expanded: true,
    bookmarks: [],
  }
  emit('update:categories', [...props.categories, newCategory])
}

function editCategory(id: string, data: { name: string; color?: string }) {
  const newCategories = props.categories.map(cat =>
    cat.id === id ? { ...cat, name: data.name, color: data.color || cat.color } : cat
  )
  emit('update:categories', newCategories)
}

function deleteCategory(id: string) {
  const newCategories = props.categories.filter(cat => cat.id !== id)
  emit('update:categories', newCategories)
}

function addBookmark(categoryId: string, data: { name: string; url?: string }) {
  const newCategories = props.categories.map(cat =>
    cat.id === categoryId
      ? { ...cat, bookmarks: [...cat.bookmarks, { id: crypto.randomUUID(), name: data.name, url: data.url || '' }] }
      : cat
  )
  emit('update:categories', newCategories)
}

function editBookmark(categoryId: string, bookmarkId: string, data: { name: string; url?: string }) {
  const newCategories = props.categories.map(cat =>
    cat.id === categoryId
      ? { ...cat, bookmarks: cat.bookmarks.map(bm => bm.id === bookmarkId ? { ...bm, ...data } : bm) }
      : cat
  )
  emit('update:categories', newCategories)
}

function deleteBookmark(categoryId: string, bookmarkId: string) {
  const newCategories = props.categories.map(cat =>
    cat.id === categoryId ? { ...cat, bookmarks: cat.bookmarks.filter(bm => bm.id !== bookmarkId) } : cat
  )
  emit('update:categories', newCategories)
}

function handleContextMenu(
  event: MouseEvent,
  type: 'category' | 'bookmark',
  categoryId: string,
  bookmarkId?: string
) {
  contextMenu.value = { x: event.clientX, y: event.clientY, type, categoryId, bookmarkId }
}

function handleCollapsedAddCategory() {
  emit('update:collapsed', false)
  setTimeout(() => openAddCategoryModal(), 300)
}

function openAddCategoryModal() {
  modalType.value = 'category'
  modalCategoryId.value = null
  modalInitial.value = null
  modalName.value = ''
  modalUrl.value = ''
  modalColor.value = COLORS[0]
  showModal.value = true
  nextTick(() => modalNameInput.value?.focus())
}

function openEditCategoryModal(categoryId: string) {
  const cat = props.categories.find(c => c.id === categoryId)
  if (!cat) return
  modalType.value = 'category'
  modalCategoryId.value = categoryId
  modalInitial.value = { name: cat.name, color: cat.color }
  modalName.value = cat.name
  modalUrl.value = ''
  modalColor.value = cat.color
  showModal.value = true
  nextTick(() => modalNameInput.value?.focus())
}

function openAddBookmarkModal(categoryId: string) {
  modalType.value = 'bookmark'
  modalCategoryId.value = categoryId
  modalInitial.value = null
  modalName.value = ''
  modalUrl.value = ''
  modalColor.value = COLORS[0]
  showModal.value = true
  nextTick(() => modalNameInput.value?.focus())
}

function openEditBookmarkModal(categoryId: string, bookmarkId: string) {
  const cat = props.categories.find(c => c.id === categoryId)
  const bm = cat?.bookmarks.find(b => b.id === bookmarkId)
  if (!bm) return
  modalType.value = 'bookmark'
  modalCategoryId.value = categoryId
  modalInitial.value = { name: bm.name, url: bm.url }
  modalName.value = bm.name
  modalUrl.value = bm.url
  modalColor.value = COLORS[0]
  showModal.value = true
  nextTick(() => modalNameInput.value?.focus())
}

function handleModalSubmit() {
  if (!modalName.value.trim()) return

  if (modalType.value === 'category') {
    if (modalInitial.value && modalCategoryId.value) {
      editCategory(modalCategoryId.value, { name: modalName.value, color: modalColor.value })
    } else {
      addCategory({ name: modalName.value, color: modalColor.value })
    }
  } else if (modalType.value === 'bookmark' && modalCategoryId.value) {
    if (modalInitial.value && modalCategoryId.value) {
      const cat = props.categories.find(c => c.id === modalCategoryId.value)
      const bmId = cat?.bookmarks.find(b => b.name === modalInitial.value?.name)?.id
      if (bmId) {
        editBookmark(modalCategoryId.value, bmId, { name: modalName.value, url: modalUrl.value })
      }
    } else {
      addBookmark(modalCategoryId.value, { name: modalName.value, url: modalUrl.value })
    }
  }

  showModal.value = false
}

onMounted(() => {
  window.addEventListener('click', () => {
    contextMenu.value = null
  })
})
</script>

<style scoped>
.sidebar-root {
  height: 100%;
}

.sidebar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  backdrop-filter: blur(20px);
  flex-shrink: 0;
  overflow: hidden;
  transition: width 0.3s ease;
  background: var(--glass-lightest);
  border-right: 1px solid var(--sidebar-border);
}

.sidebar-collapsed {
  width: 64px;
}

.sidebar-expanded {
  width: 220px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 12px;
  flex-shrink: 0;
}

.sidebar-title {
  color: rgba(255, 255, 255, 0.8);
  user-select: none;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.collapse-btn {
  margin-left: auto;
}

.sidebar-categories {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  color: rgba(255, 255, 255, 0.7);
}

.category-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.category-item--active {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.category-icon {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.category-icon--active {
  transform: scale(1.1);
}

.category-name {
  flex: 1;
  user-select: none;
  font-size: 13px;
  font-weight: 500;
  transition: color 0.2s;
}

.category-name--active {
  color: #fff;
}

.category-arrow {
  color: rgba(255, 255, 255, 0.6);
  flex-shrink: 0;
}

.category-hover-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.category-item:hover .category-hover-actions {
  opacity: 1;
}

.hover-action-btn {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.5);
}

.hover-action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.sidebar-footer {
  padding: 12px 8px;
  flex-shrink: 0;
}

.add-category-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
  background: transparent;
}

.add-category-btn:hover {
  color: rgba(255, 255, 255, 0.7);
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.05);
}

.add-category-btn-collapsed {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.4);
  background: transparent;
}

.add-category-btn-collapsed:hover {
  color: rgba(255, 255, 255, 0.7);
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.05);
}

.context-menu {
  position: fixed;
  z-index: 9998;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  background: rgba(30, 30, 40, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid var(--sidebar-border);
  min-width: 160px;
  padding: 4px;
}

.context-menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.15s;
  font-size: 13px;
  border-radius: 8px;
}

.context-menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.context-menu-item--danger {
  color: #f87171;
}

.context-menu-item--danger:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.context-menu-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 4px 8px;
}

.color-picker-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.color-swatch {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  transition: transform 0.15s;
  position: relative;
  border: none;
  cursor: pointer;
}

.color-swatch:hover {
  transform: scale(1.1);
}

.color-swatch--active {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.check-icon {
  position: absolute;
  inset: 0;
  margin: auto;
  color: #fff;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
