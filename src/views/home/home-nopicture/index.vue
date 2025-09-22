<template>
  <div class="home-base">
    <div
      class="backdrop-blur-sm size-full px-4 sm:px-10 pt-30 flex flex-col gap-10"
    >
      <h1 class="flex justify-center items-center gap-4 text-gray-400 text-4xl">
        <img class="w-[50px]" :src="logo" alt="" />
        <span>Construere</span>
      </h1>
      <div class="flex justify-center">
        <div
          class="w-full xl:w-1/2 h-12 bg-gray-200/50 rounded-3xl flex items-center px-4"
        >
          <input class="w-full focus:outline-[0px]" type="text" />
        </div>
      </div>
      <div class="home-base-app">
        <div class="text-white" v-for="() in 10"></div>
      </div>
    </div>
    <!-- Dialog -->
    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25"></div>
        </TransitionChild>
        <div class="fixed inset-0 overflow-y-auto">
          <div
            class="flex min-h-full items-center justify-center p-4 text-center"
          >
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
              >
                <!-- <DialogTitle
                  as="h3"
                  class="text-lg font-medium leading-6 text-gray-900"
                >
                  Payment successful
                </DialogTitle> -->
                <div class="mt-2 flex justify-between">
                  <!-- <div class="flex-1">
                    <img class="w-[50px]" :src="logo" alt="" />
                  </div> -->
                  <Step class="w-[300px]"></Step>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import logo from '@/assets/image/logo.png'
import {
  TransitionChild,
  TransitionRoot,
  Dialog,
  DialogPanel,
} from '@headlessui/vue'
import Step from '@/components/Step.vue'
const isOpen = ref(true)

const closeModal = (value: boolean) => {
  isOpen.value = value
}
</script>
<style lang="scss">
.home-base {
  height: 100vh;
  &-app {
    display: grid;
    // grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
    grid-template-columns: repeat(auto-fill, 100px);
    gap: 2rem;
    > div {
      background: rgba(255, 255, 255, 0.5);
      // backdrop-filter: blur(10px);
      border-radius: 8px;
      padding: 12px;
      height: 100px;
    }
  }
}
</style>
