<template>
  <div class="widget bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
    <h3 class="text-white/80 text-sm mb-4">搜索</h3>
    <div class="flex gap-2">
      <el-input
        v-model="searchQuery"
        placeholder="输入搜索内容..."
        @keyup.enter="handleSearch"
        class="flex-1"
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>
    <div class="flex gap-2 mt-4">
      <el-button size="small" @click="searchWith('baidu')">百度</el-button>
      <el-button size="small" @click="searchWith('google')">Google</el-button>
      <el-button size="small" @click="searchWith('bing')">必应</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')

const searchWith = (engine: string) => {
  if (!searchQuery.value.trim()) return
  let url = ''
  switch (engine) {
    case 'baidu':
      url = `https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery.value)}`
      break
    case 'google':
      url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery.value)}`
      break
    case 'bing':
      url = `https://www.bing.com/search?q=${encodeURIComponent(searchQuery.value)}`
      break
  }
  window.open(url, '_blank')
}

const handleSearch = () => {
  searchWith('baidu')
}
</script>
