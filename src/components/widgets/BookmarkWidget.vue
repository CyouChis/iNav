<template>
  <div class="widget bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
    <h3 class="text-white/80 text-sm mb-4">快捷链接</h3>
    <div class="grid grid-cols-2 gap-3">
      <a
        v-for="bookmark in bookmarks"
        :key="bookmark.id"
        :href="bookmark.url"
        target="_blank"
        class="flex items-center gap-2 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all text-white"
      >
        <span class="text-2xl">{{ bookmark.icon }}</span>
        <span class="text-sm">{{ bookmark.name }}</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const bookmarks = ref([
  { id: 1, name: 'GitHub', url: 'https://github.com', icon: '💻' },
  { id: 2, name: '知乎', url: 'https://zhihu.com', icon: '📚' },
  { id: 3, name: 'B站', url: 'https://bilibili.com', icon: '🎬' },
  { id: 4, name: '微博', url: 'https://weibo.com', icon: '📱' }
])
</script>
