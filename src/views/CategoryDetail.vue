<template>
  <div class="category-detail">
    <div class="detail-header">
      <div class="header-left">
        <el-button text circle @click="goBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </el-button>
        <div class="header-info">
          <div
            class="category-icon"
            :style="{ backgroundColor: category?.color + '33', color: category?.color }"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h1 class="category-title">{{ category?.name }}</h1>
        </div>
      </div>

      <el-button @click="showAddBookmarkModal = true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        添加书签
      </el-button>
    </div>

    <el-row v-if="category" :gutter="16">
      <el-col
        v-for="bookmark in category.bookmarks"
        :key="bookmark.id"
        :xs="12"
        :sm="8"
        :md="6"
        :lg="5"
        :xl="4"
      >
        <a
          :href="getDisplayUrl(bookmark.url)"
          target="_blank"
          rel="noopener noreferrer"
          class="bookmark-card"
        >
          <div class="bookmark-icon-wrapper">
            <img
              v-if="bookmark.url"
              :src="getFavicon(bookmark.url)"
              alt=""
              class="bookmark-favicon"
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
              class="bookmark-placeholder-icon"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <h3 class="bookmark-name">{{ bookmark.name }}</h3>
        </a>
      </el-col>

      <el-col
        v-if="category.bookmarks.length === 0"
        :span="24"
      >
        <div class="empty-state">
          <div class="empty-icon-wrapper">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-icon">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
          </div>
          <p class="empty-text">此分类暂无书签</p>
          <el-button @click="showAddBookmarkModal = true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            添加第一个书签
          </el-button>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      v-model="showAddBookmarkModal"
      title="添加书签"
      width="400px"
    >
      <el-form label-position="top" @submit.prevent="addNewBookmark">
        <el-form-item label="名称">
          <el-input
            v-model="newBookmark.name"
            placeholder="书签名称"
          />
        </el-form-item>
        <el-form-item label="网址">
          <el-input
            v-model="newBookmark.url"
            placeholder="https://example.com"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddBookmarkModal = false">取消</el-button>
        <el-button
          type="primary"
          :style="{ backgroundColor: category?.color || '#6366f1', borderColor: category?.color || '#6366f1' }"
          @click="addNewBookmark"
        >
          保存
        </el-button>
      </template>
    </el-dialog>
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
.category-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 40px 32px;
  min-width: 0;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-title {
  color: #fff;
  font-size: 24px;
  font-weight: 700;
}

.bookmark-card {
  display: block;
  border-radius: 16px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  transition: all 0.2s;
  text-decoration: none;
  margin-bottom: 16px;
}

.bookmark-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.bookmark-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.bookmark-favicon {
  width: 40px;
  height: 40px;
}

.bookmark-placeholder-icon {
  color: rgba(255, 255, 255, 0.4);
}

.bookmark-name {
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
}

.empty-icon-wrapper {
  width: 96px;
  height: 96px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.empty-icon {
  color: rgba(255, 255, 255, 0.3);
}

.empty-text {
  color: rgba(255, 255, 255, 0.4);
  font-size: 18px;
  margin-bottom: 16px;
}
</style>
