<template>
  <div>
    <div class="flex items-start gap-4" v-for="(item, index) in props.stepLIst">
      <div class="flex flex-col items-center">
        <!-- 步骤图标 -->
        <div>
          <!-- 已完成 -->
          <div
            v-if="item.state === 1"
            class="flex items-center justify-center w-[50px] h-[50px] bg-indigo-600 rounded-[50%]"
          >
            <div class="size-[40%] bg-white rounded-[50%]"></div>
          </div>
          <!-- 进行中 -->
          <div
            v-else-if="item.state === 2"
            class="flex items-center justify-center w-[50px] h-[50px] bg-white rounded-[50%] border-2 border-solid border-indigo-600 relative z-10"
          >
            <div
              class="size-full animate-ping bg-indigo-600 rounded-[50%] absolute z-0"
            ></div>
            <div class="size-[40%] bg-indigo-600 rounded-[50%]"></div>
          </div>
          <!-- 未完成 -->
          <div
            v-else-if="item.state === 3"
            class="flex items-center justify-center w-[50px] h-[50px] bg-white rounded-[50%] border-2 border-solid border-gray-300"
          >
            <div class="size-[40%] bg-gray-300 rounded-[50%]"></div>
          </div>
        </div>
        <!-- 步骤线 -->
        <div
          v-if="index !== 4"
          class="w-1 h-[50px] my-1"
          :class="item.state === 1 ? 'bg-indigo-600' : 'bg-gray-300'"
        ></div>
      </div>
      <!-- 右侧文字 -->
      <div :class="item.state === 1 ? '' : 'text-gray-300'">
        <p class="text-xl font-bold">{{ item.title }}</p>
        <p>{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
interface StepItem {
  state: number
  title: string
  description: string
}
interface Props {
  stepLIst?: StepItem[]
}
const props = withDefaults(defineProps<Props>(), {
  stepLIst: () => [
    {
      state: 1,
      title: 'Step One',
      description: 'this is the first step',
    },
    {
      state: 2,
      title: 'Step Two',
      description: 'this is the second step',
    },
    {
      state: 3,
      title: 'Step Three',
      description: 'this is the third step',
    },
    {
      state: 3,
      title: 'Step Four',
      description: 'this is the fourth step',
    },
    {
      state: 3,
      title: 'Step Five',
      description: 'this is the fifth step',
    },
  ],
})
</script>
<style lang="scss"></style>
