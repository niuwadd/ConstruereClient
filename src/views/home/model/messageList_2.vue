<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" :initialFocus="titleRef" @close="closeModal" class="relative z-10">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#f3f2fb] p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 text-center mb-8">
                <p ref="titleRef">Payment successful</p>
              </DialogTitle>
              <div class="mt-2 flex flex-col gap-4 h-[calc(100vh-300px)] overflow-auto">
                <template v-for="(item, index) in agentMessageList" :key="index">
                  <!-- user -->
                  <div class="bg-[#5f40a6] text-white p-4 w-[70%] rounded-bl-2xl rounded-t-2xl self-end"
                    v-if="item.type === 'user'">
                    <pre class="whitespace-break-spaces font-[monospace] text-sm">{{ item.text }}</pre>
                  </div>
                  <!-- agent -->
                  <div class="bg-[#23272a] text-white p-4 w-[70%] rounded-br-2xl rounded-t-2xl self-start"
                    v-else-if="item.type === 'agent'">
                    <img v-if="item.img && typeof item.text === 'string'" class="w-full" :src="item.text" alt="">
                    <pre v-else class="whitespace-break-spaces font-[monospace] text-sm">{{ item.text }}</pre>
                  </div>
                </template>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import type { Message } from '../types'
import { ref, toRef } from 'vue'
const isOpen = defineModel<boolean>()
const props = defineProps({
  agentMessageList: Array<Message>,
})
const agentMessageList = toRef(props, 'agentMessageList')
const titleRef = ref<HTMLElement | null>(null)
function closeModal() {
  isOpen.value = false
}
</script>

<style lang="scss" scoped></style>
