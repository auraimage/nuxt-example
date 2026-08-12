<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { uploadOne } from '@auraimage/sdk/client'
import type { UploadResult } from '@auraimage/sdk/client'

const PRESETS = [
  { label: 'Thumbnail 200w WebP', transform: 'w=200,h=200', ext: '.webp' },
  { label: 'Medium 600w AVIF', transform: 'w=600', ext: '.avif' },
  { label: 'Full 1200w (auto format)', transform: 'w=1200', ext: '' }
]

// Serve-URL grammar: {base}/{project}/{transform}/{name}[.ext].
// The transform segment goes right before the name; no extension = the CDN
// picks the best format the browser supports (AVIF -> WebP -> JPEG).
function variantUrl(image: UploadResult, preset: (typeof PRESETS)[number]): string {
  const base = image.url.slice(0, image.url.length - image.name.length)
  return `${base}${preset.transform}/${image.name}${preset.ext}`
}

const healthy = ref<boolean | null>(null)
const image = ref<UploadResult | null>(null)
const uploading = ref(false)
const error = ref<string | null>(null)

async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch('/api/health')
    return res.ok
  } catch {
    return false
  }
}

async function getUploadToken(): Promise<{ token: string; cdnUrl: string }> {
  const res = await fetch('/api/upload-token', { method: 'POST' })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error ?? 'Failed to get upload token')
  }
  return res.json()
}

onMounted(async () => {
  healthy.value = await checkHealth()
})

async function handleUpload(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploading.value = true
  error.value = null

  try {
    const { token, cdnUrl } = await getUploadToken()
    const result = await uploadOne(file, {
      token,
      url: `${cdnUrl}/v1/upload`
    })
    image.value = result
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Upload failed'
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-4">
      Server:
      <span v-if="healthy === null" class="text-neutral-400">Checking...</span>
      <span v-else-if="healthy" class="text-green-600">Connected</span>
      <span v-else class="text-red-600">Not running — check your .env file</span>
    </div>

    <div class="mb-6">
      <input
        type="file"
        accept="image/*"
        @change="handleUpload"
        :disabled="uploading"
        class="block w-full max-w-xs text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-neutral-900 file:text-white hover:file:bg-neutral-800"
      />
      <p v-if="uploading" class="text-neutral-500 mt-2">Uploading...</p>
      <p v-if="error" class="text-red-600 mt-2">Upload failed: {{ error }}</p>
    </div>

    <div v-if="image" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="preset in PRESETS" :key="preset.label" class="bg-white border border-neutral-200 rounded-lg p-4">
        <p class="text-sm font-medium text-neutral-600 mb-3">{{ preset.label }}</p>
        <img :src="variantUrl(image, preset)" :alt="preset.label" class="w-full h-auto rounded" />
        <code class="text-xs text-neutral-500 mt-3 block break-all">
          {{ variantUrl(image, preset) }}
        </code>
      </div>
    </div>
  </div>
</template>
