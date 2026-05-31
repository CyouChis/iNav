<template>
  <div class="h-full">
    <div
      class="h-full flex flex-col relative backdrop-blur-glass-light shrink-0 overflow-hidden transition-[width] duration-300 ease-sidebar bg-glass-lightest border-r border-sidebar"
      :class="collapsed ? 'w-sidebar-collapsed' : 'w-sidebar-expanded'"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-3 py-4 shrink-0">
        <span
          v-if="!collapsed"
          class="text-white/80 select-none text-sm font-semibold tracking-wider"
        >
          我的书签
        </span>
        <button
          @click="$emit('update:collapsed', !collapsed)"
          class="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all ml-auto"
        >
          <svg
            v-if="collapsed"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
          <svg
            v-else
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      </div>

      <!-- Categories -->
      <div class="flex-1 overflow-y-auto overflow-x-hidden px-2 space-y-1">
        <div v-for="cat in categories" :key="cat.id">
          <!-- Category header -->
          <div
            class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer group transition-all duration-200"
            :class="[
              isActiveCategory(cat.id) 
                ? 'bg-white/15 text-white shadow-sm' 
                : 'text-white/70 hover:bg-white/10 hover:text-white/90'
            ]"
            @click="handleCategoryClick(cat.id)"
            @contextmenu.prevent="handleContextMenu($event, 'category', cat.id)"
          >
            <div
              class="w-6 h-6 rounded-lg shrink-0 flex items-center justify-center transition-transform duration-200"
              :class="{ 'scale-110': isActiveCategory(cat.id) }"
              :style="{ backgroundColor: cat.color + (isActiveCategory(cat.id) ? '44' : '22'), color: isActiveCategory(cat.id) ? cat.color : cat.color + 'cc' }"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <template v-if="!collapsed">
              <span 
                class="flex-1 select-none text-[13px] font-medium transition-colors"
                :class="{ 'text-white': isActiveCategory(cat.id) }"
              >
                {{ cat.name }}
              </span>
              <!-- Arrow indicator for active category -->
              <svg 
                v-if="isActiveCategory(cat.id)" 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2.5" 
                stroke-linecap="round" 
                stroke-linejoin="round"
                class="text-white/60 shrink-0"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
              <div v-else class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  @click.stop="openAddBookmarkModal(cat.id)"
                  class="w-5 h-5 flex items-center justify-center rounded-md hover:bg-white/20 text-white/50 hover:text-white transition-colors"
                  title="添加书签"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Add Category -->
      <div class="px-2 py-3 shrink-0">
        <button
          v-if="!collapsed"
          @click="openAddCategoryModal()"
          class="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-white/20 text-white/40 hover:text-white/70 hover:border-white/30 hover:bg-white/5 transition-all text-xs"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          添加分类
        </button>
        <button
          v-else
          @click="handleCollapsedAddCategory"
          class="w-8 h-8 flex items-center justify-center rounded-xl border border-dashed border-white/20 text-white/40 hover:text-white/70 hover:border-white/30 hover:bg-white/5 transition-all mx-auto"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Context Menu -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="contextMenu"
          class="fixed z-[9998] rounded-xl shadow-xl overflow-hidden bg-[rgba(30,30,40,0.95)] backdrop-blur-[20px] border border-sidebar min-w-[160px]"
          :style="{
            left: contextMenu.x + 'px',
            top: contextMenu.y + 'px',
          }"
          @click.stop
        >
        <template v-if="contextMenu.type === 'category'">
          <button
            class="w-full flex items-center gap-2.5 px-4 py-2.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors text-sm"
            @click="openAddBookmarkModal(contextMenu.categoryId); contextMenu = null"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            添加书签
          </button>
          <button
            class="w-full flex items-center gap-2.5 px-4 py-2.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors text-sm"
            @click="openEditCategoryModal(contextMenu.categoryId); contextMenu = null"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
            编辑分类
          </button>
          <div class="h-px bg-white/10 mx-2" />
          <button
            class="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors text-sm"
            @click="deleteCategory(contextMenu.categoryId); contextMenu = null"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            删除分类
          </button>
        </template>
        <template v-else-if="contextMenu.type === 'bookmark' && contextMenu.bookmarkId">
          <button
            class="w-full flex items-center gap-2.5 px-4 py-2.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors text-sm"
            @click="openEditBookmarkModal(contextMenu.categoryId, contextMenu.bookmarkId!); contextMenu = null"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
            编辑书签
          </button>
          <div class="h-px bg-white/10 mx-2" />
          <button
            class="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors text-sm"
            @click="deleteBookmark(contextMenu.categoryId, contextMenu.bookmarkId!); contextMenu = null"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            删除书签
          </button>
        </template>
      </div>
      </Transition>
    </Teleport>

    <!-- Edit Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="fixed inset-0 z-[9999] flex items-center justify-center" @click.self="showModal = false">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            class="relative rounded-2xl shadow-2xl p-6 w-[360px] bg-gray-900/95 border border-white/12 backdrop-blur-glass-light"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-white text-base font-semibold">
                {{ modalInitial ? (modalType === 'category' ? '编辑分类' : '编辑书签') : (modalType === 'category' ? '添加分类' : '添加书签') }}
              </h3>
              <button
                @click="showModal = false"
                class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-500 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <form @submit.prevent="handleModalSubmit" class="space-y-4">
              <div>
                <label class="block text-white/50 mb-1.5 text-sm">名称</label>
                <input
                  ref="modalNameInput"
                  v-model="modalName"
                  :placeholder="modalType === 'category' ? '分类名称' : '书签名称'"
                  class="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white outline-none focus:border-indigo-500 transition-colors text-sm"
                />
              </div>
              <div v-if="modalType === 'bookmark'">
                <label class="block text-white/50 mb-1.5 text-sm">网址</label>
                <input
                  v-model="modalUrl"
                  placeholder="https://example.com"
                  class="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white outline-none focus:border-indigo-500 transition-colors text-sm"
                />
              </div>
              <div v-if="modalType === 'category'">
                <label class="block text-white/50 mb-1.5 text-sm">颜色</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="color in COLORS"
                    :key="color"
                    type="button"
                    @click="modalColor = color"
                    class="w-7 h-7 rounded-full transition-transform hover:scale-110 relative"
                    :style="{ backgroundColor: color }"
                  >
                    <svg
                      v-if="modalColor === color"
                      class="absolute inset-0 m-auto text-white"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="flex gap-2 pt-2">
                <button
                  type="button"
                  @click="showModal = false"
                  class="flex-1 py-2.5 rounded-xl border border-white/12 text-white/60 hover:bg-white/10 transition-colors text-sm"
                >
                  取消
                </button>
                <button
                  type="submit"
                  class="flex-1 py-2.5 rounded-xl text-white transition-all hover:opacity-90 active:scale-95 text-sm"
                  :style="{ backgroundColor: modalType === 'category' ? modalColor : '#6366f1' }"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
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

// Modal state
const showModal = ref(false)
const modalType = ref<'category' | 'bookmark'>('category')
const modalCategoryId = ref<string | null>(null)
const modalInitial = ref<{ name: string; url?: string; color?: string } | null>(null)
const modalName = ref('')
const modalUrl = ref('')
const modalColor = ref(COLORS[0])
const modalNameInput = ref<HTMLInputElement | null>(null)

// Context menu state
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

// Close context menu on click anywhere
onMounted(() => {
  window.addEventListener('click', () => {
    contextMenu.value = null
  })
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
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
</style>
