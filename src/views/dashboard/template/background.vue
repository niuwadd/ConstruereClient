<template>
  <div v-if="notifications.length" class="h-full flex flex-col gap-4 overflow-auto" ref="backgroundRef">
    <div v-for="item in notifications" :key="item.id"
      class="bg-white/60 text-gray-600 p-4 max-w-[100%] rounded-2xl flex justify-between items-end">
      <div>
        <h2 class="font-bold text-lg">{{ item.msg }}</h2>
        <p>{{ item.app }}</p>
      </div>
      <!-- <p>{{ item.time }}</p> -->
    </div>
  </div>
  <div v-else class="h-full flex flex-col justify-center">
    <NotAvailable class="fill-white w-full" />
    <div class="text-center text-white">{{ t('message.notMessage') }}</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import autoAnimate from "@formkit/auto-animate"
import type { Message } from "@/types/types"
import { useI18n } from 'vue-i18n'
import NotAvailable from "@/assets/svg/not-available.svg"
const { t } = useI18n()
const props = defineProps<{
  currentMessage?: Message
}>()
const backgroundRef = ref<HTMLElement | null>(null)
const notifications = reactive<Message[]>([
  /*   {
      name: "Payment received",
      description: "Inspira UI",
      time: "15m ago",
      icon: "💸",
      color: "#00C9A7",
    },
    {
      name: "User signed up",
      description: "Inspira UI",
      time: "10m ago",
      icon: "👤",
      color: "#FFB800",
    },
    {
      name: "New message",
      description: "Inspira UI",
      time: "5m ago",
      icon: "💬",
      color: "#FF3D71",
    },
    {
      name: "New event",
      description: "Inspira UI",
      time: "2m ago",
      icon: "🗞️",
      color: "#1E86FF",
    },
    {
      name: "Task completed",
      description: "Inspira UI",
      time: "1m ago",
      icon: "✅",
      color: "#45B26B",
    }, */
]);
watch(() => props.currentMessage, (value) => {
  if (value) {
    notifications.unshift(value)
  }
}, { deep: true })
onMounted(() => {
  if (backgroundRef.value) autoAnimate(backgroundRef.value)
})
</script>