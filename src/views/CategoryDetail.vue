<template>
  <div class="flex-1 flex flex-col px-8 py-10 min-w-0">
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-3">
        <button
          @click="goBack"
          class="w-10 h-10 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center"
            :style="{ backgroundColor: category?.color + '33', color: category?.color }"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h1 class="text-white text-2xl font-bold">{{ category?.name }}</h1>
        </div>
      </div>
      
      <button
        @click="showAddBookmarkModal = true"
        class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        添加书签
      </button>
    </div>

    <div v-if="category" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      <div
        v-for="bookmark in category.bookmarks"
        :key="bookmark.id"
        class="group relative"
      >
        <a
          :href="getDisplayUrl(bookmark.url)"
          target="_blank"
          rel="noopener noreferrer"
          class="block rounded-2xl p-6 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-center"
        >
          <div class="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3">
            <img
              v-if="bookmark.url"
              :src="getFavicon(bookmark.url)"
              alt=""
              class="w-10 h-10"
              @error="($event.target as HTMLImageElement).style.display = 'none'"
            />
            <svg
              v-else
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-white/40"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <h3 class="text-white font-semibold text-sm truncate">{{ bookmark.name }}</h3>
        </a>
      </div>
      
      <div
        v-if="category.bookmarks.length === 0"
        class="col-span-full flex flex-col items-center justify-center py-20"
      >
        <div class="w-24 h-24 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-white/30">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
        </div>
        <p class="text-white/40 text-lg mb-4">此分类暂无书签</p>
        <button
          @click="showAddBookmarkModal = true"
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          添加第一个书签
        </button>
      </div>
    </div>

    <!-- 添加书签模态框 -->
    <Transition name="fade">
      <div v-if="showAddBookmarkModal" class="fixed inset-0 z-50 flex items-center justify-center" @click.self="showAddBookmarkModal = false">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div class="relative rounded-2xl shadow-2xl p-6 w-[400px] bg-gray-900/95 border border-white/12 backdrop-blur-glass-light">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-white text-lg font-semibold">添加书签</h3>
            <button
              @click="showAddBookmarkModal = false"
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="addNewBookmark" class="space-y-4">
            <div>
              <label class="block text-white/60 mb-2 text-sm">名称</label>
              <input
                v-model="newBookmark.name"
                placeholder="书签名称"
                class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label class="block text-white/60 mb-2 text-sm">网址</label>
              <input
                v-model="newBookmark.url"
                placeholder="https://example.com"
                class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div class="flex gap-3 pt-2">
              <button
                type="button"
                @click="showAddBookmarkModal = false"
                class="flex-1 py-3 rounded-xl border border-white/15 text-white/70 hover:bg-white/10 hover:text-white transition-all"
              >
                取消
              </button>
              <button
                type="submit"
                class="flex-1 py-3 rounded-xl text-white transition-all hover:opacity-90 active:scale-95"
                :style="{ backgroundColor: category?.color || '#6366f1' }"
              >
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Category, Bookmark } from '../components/widgets/SidebarWidget.vue'

interface Props {
  categories: Category[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:categories': [value: Category[]]
}>()

const route = useRoute()
const router = useRouter()
const showAddBookmarkModal = ref(false)
const newBookmark = ref<Omit<Bookmark, 'id'>>({
  name: '',
  url: ''
})

const category = computed(() => 
  props.categories.find(cat => cat.id === route.params.categoryId)
)

function getFavicon(url: string): string {
  try {
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
  } catch {
    return ''
  }
}

function getDisplayUrl(url: string): string {
  if (!url.startsWith('http')) return `https://${url}`
  return url
}

function goBack() {
  router.push('/')
}

function addNewBookmark() {
  if (!newBookmark.value.name.trim() || !category.value) return
  
  const updatedCategories = props.categories.map(cat => {
    if (cat.id === category.value!.id) {
      return {
        ...cat,
        bookmarks: [
          ...cat.bookmarks,
          {
            id: crypto.randomUUID(),
            name: newBookmark.value.name,
            url: newBookmark.value.url
          }
        ]
      }
    }
    return cat
  })
  
  emit('update:categories', updatedCategories)
  newBookmark.value = { name: '', url: '' }
  showAddBookmarkModal.value = false
}
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
</style>
