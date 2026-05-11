<template>
  <div class="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold text-white mb-8 text-center">iNav 新标签页</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ClockWidget />
        <SearchWidget />
        <WeatherWidget />
        <BookmarkWidget />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ClockWidget from './components/widgets/ClockWidget.vue'
import SearchWidget from './components/widgets/SearchWidget.vue'
import WeatherWidget from './components/widgets/WeatherWidget.vue'
import BookmarkWidget from './components/widgets/BookmarkWidget.vue'
</script>
