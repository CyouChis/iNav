<template>
  <div>
    <!-- Glass container -->
    <div
      class="glass-widget"
    >
      <!-- Top highlight -->
      <div
        class="absolute top-0 left-8 right-8 pointer-events-none h-px bg-highlight-gradient"
      />

      <div class="flex flex-wrap justify-center gap-1">
        <TransitionGroup name="fade" tag="div" class="flex flex-wrap justify-center gap-1">
          <div v-for="link in links" :key="link.id" class="relative group">
            <button
              v-if="editing"
              @click.stop="removeLink(link.id)"
              class="absolute -top-1 -right-1 z-10 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg"
            >
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
            <a
              :href="getDisplayUrl(link.url)"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-all group/link"
              style="width: 64px"
              @click.prevent="editing && $event.preventDefault()"
            >
              <div
                class="w-8 h-8 flex items-center justify-center rounded-xl transition-all group-hover/link:scale-110 group-hover/link:shadow-lg bg-glass-lightest"
              >
                <img
                  v-if="link.url"
                  :src="getFavicon(link.url)"
                  :alt="link.name"
                  class="w-5 h-5"
                  @error="($event.target as HTMLImageElement).style.display = 'none'"
                />
                <svg
                  v-else
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-white/50"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <span
                class="text-white/55 text-center truncate w-full group-hover/link:text-white/90 transition-colors"
                style="font-size: 10px"
              >
                {{ link.name }}
              </span>
            </a>
          </div>
        </TransitionGroup>

        <button
          @click="showAdd = true"
          class="flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-all hover:bg-white/8"
          style="width: 64px"
        >
          <div
            class="w-8 h-8 flex items-center justify-center rounded-xl text-white/25 hover:text-white/50 transition-colors bg-glass-subtle border border-dashed border-glass-border-dashed"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </div>
          <span class="text-white/25" style="font-size: 10px">添加</span>
        </button>
      </div>

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
import { ref, watch } from 'vue'
import defaultLinksData from '@/config/links.json'

export interface QuickLink {
  id: string
  name: string
  url: string
}

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
</style>
