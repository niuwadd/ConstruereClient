<template>
  <div class="size-full p-10">
    <!-- <div @click="router.push('/dashboard/homePage')" class="absolute top-2 left-2">
      <Back class="size-8 fill-white" />
    </div> -->
    <div class="h-full grid grid-rows-2 grid-cols-2 gap-4">
      <div @click="router.push({
        path: '/dashboard/homePage',
        query: {
          id: item.id
        }
      })" v-for="item in messageStore.messageList" class="flex flex-col">
        <div
          class="rounded-tr-2xl rounded-tl-2xl bg-white/25 px-4 py-2 border-b-[1px] border-solid border-white/25 flex justify-between items-center">
          <h2 @click.stop="updateScroll(item.id)" class="text-white">{{ item.appName }}</h2>
          <div class="flex gap-4">
            <InfoCircle v-if="item.isAnswer" class="fill-white size-5" />
            <Close @click.stop="clearMessage(item.id)" class="fill-white size-5" />
          </div>
        </div>
        <div :ref="el => setScrollRef(el as HTMLElement | null, item.id)"
          class="rounded-br-2xl rounded-bl-2xl bg-white/25 p-4 pt-0 flex-1 min-h-[200px] overflow-hidden">
          <MessageList class="p-4" :agentMessageList="handelerMessageList(item.list)" />
        </div>
      </div>
    </div>
    <!-- <button @click="viewStore" class="absolute top-0 right-20">click</button> -->
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useMessageStore } from "@/store/message"
import MessageList from '@/components/MessageList.vue'
import Close from "@/assets/svg/close.svg"
import InfoCircle from "@/assets/svg/info-circle.svg"
// import Back from "@/assets/svg/back.svg"
// 引入 BetterScroll
import BScroll from '@better-scroll/core'
const messageStore = useMessageStore()
const router = useRouter()
const handelerMessageList = computed(() => {
  return (list: any): any => {
    return list.map((item: any) => {
      return {
        text: item.msg,
        type: 'agent'
      }
    })
  }
})
// 存储滚动实例的映射
const scrollInstances = new Map()
// 设置滚动引用并初始化 BScroll
const setScrollRef = (el: HTMLElement | null, id: string) => {
  nextTick(() => {
    if (el) {
      // 等待下一次 DOM 更新
      // 销毁已存在的实例
      if (scrollInstances.has(id)) {
        scrollInstances.get(id).destroy()
      }
      // 创建新的滚动实例
      const scrollInstance = new BScroll(el, {
        probeType: 3,
        scrollY: true,
        click: true,
        bounce: true
      })
      scrollInstances.set(id, scrollInstance)
    }
  })

}
const updateScroll = (id: string) => {
  nextTick(() => {
    if (scrollInstances.has(id)) {
      const bs = scrollInstances.get(id)
      console.log(bs);
      bs.refresh()
      bs.scrollTo(0, bs.maxScrollY, 300)
    }
  })
}
const clearMessage = (id: string) => {
  messageStore.clearMessage(id)
}

/* const getGridCols = computed(() => {
  const closNumber = Math.ceil(messageStore.messageList.length / 2)
  return messageStore.messageList.length > 4 ? `grid-cols-${closNumber}` : 'grid-cols-2'
}) */
/* const viewStore = () => {
  console.log(messageStore.messageList);
} */
onMounted(() => {

})
// 组件销毁前清理滚动实例
onBeforeUnmount(() => {
  scrollInstances.forEach(instance => {
    instance.destroy()
  })
  scrollInstances.clear()
})
</script>
<style lang="scss" scoped>
/* HTML: <div class="loader"></div> */
.loader {
  width: 6px;
  aspect-ratio: 1;
  border-radius: 50%;
  animation: l5 1s infinite linear alternate;
}

@keyframes l5 {
  0% {
    box-shadow: 20px 0 #000, -20px 0 #0002;
    background: #000
  }

  33% {
    box-shadow: 20px 0 #000, -20px 0 #0002;
    background: #0002
  }

  66% {
    box-shadow: 20px 0 #0002, -20px 0 #000;
    background: #0002
  }

  100% {
    box-shadow: 20px 0 #0002, -20px 0 #000;
    background: #000
  }
}
</style>