<template>
  <div
    class="bg-linear-to-b from-[#E4DBED] via-[#E8EADE] to-[#ECDEDF] size-full flex portrait:overflow-auto portrait:gap-4 portrait:flex-col">
    <div
      class="flex flex-col justify-between items-center pl-4 pb-4 pt-14 portrait:flex-row portrait:pt-4 portrait:px-8">
      <ul class="flex gap-4 flex-col portrait:flex-row">
        <li v-for="item in agentList" class="size-8 sm:size-10" :class="item.isActive ? '' : 'opacity-50'">
          <img :src="item.icon" alt="" />
        </li>
      </ul>
      <div class="flex flex-col gap-2 portrait:flex-row">
        <div class="size-[40px] flex justify-center items-center rounded-full bg-white/50">
          <Settings class="size-[60%]" />
        </div>
        <div class="size-[40px] rounded-full bg-white/50"></div>
      </div>
    </div>
    <!-- 3d 模型 -->
    <!-- <div ref="canvasRef" class="flex-1 min-h-[200px] landscape:min-h-[100px]">
    </div> -->
    <!-- 卡片 -->
    <div
      class="flex flex-col gap-4 relative px-8 py-4 w-[380px] min-w-[320px] landscape:overflow-auto portrait:w-full portrait:self-center">
      <h2 class="text-center text-lg font-bold">{{ currentAgent?.title }}</h2>
      <!-- 设备卡片 -->
      <div class="rounded-4xl shadow-[0_0_10px_4px_rgba(0,0,0,0.1)] relative px-1 pb-1">
        <div class="flex justify-end p-3">
          <div @click="currentAgent && (currentAgent.isActive = !currentAgent.isActive)"
            class="size-[30px] rounded-full bg-white flex justify-center items-center">
            <Plus />
          </div>
        </div>
        <div class="flex flex-col gap-2 bg-white rounded-4xl py-4 px-6">
          <div class="min-h-[140px] relative">
            <img class="bot-img w-[180px] absolute -top-12 left-[50%] transform-[translateX(-50%)]"
              :src="currentAgent?.icon" alt="">
            </img>
          </div>
          <div class="text-xl font-bold font-sans text-gray-600 relative z-[2]">
            <p>您好，</p>
            <p>{{ currentAgent?.title_1 }}</p>
          </div>
          <p class="text-sm font-bold text-gray-500 relative z-[2]">{{ currentAgent?.description }}</p>
          <!-- <div class="absolute inset-0 top-[40%] backdrop-blur-[2px]"></div> -->
          <div class="flex gap-4 justify-between">
            <div class="flex flex-col gap-2 items-center relative">
              <img :src="Examination_0" alt=""></img>
              <p class="absolute bottom-2 font-bold text-gray-500">摄像头</p>
            </div>
            <div class="flex flex-col gap-2 items-center relative">
              <img :src="Fitness_band_0" alt=""></img>
              <p class="absolute bottom-2 font-bold text-gray-500">运动手环</p>
            </div>
          </div>
        </div>

      </div>
      <!-- 设备列表 -->
      <Transition v-if="screenOrientation" name="control" mode="out-in">
        <div v-show="currentAgent && currentAgent.isActive" class="flex justify-between mt-auto">
          <div v-for="item in hardwareList" class="bg-white rounded-full p-2"
            :class="item.isActive ? 'animate-bounce' : ''">
            <img class="w-[30px]" :src="item.icon" alt="">
          </div>
        </div>
      </Transition>
    </div>
    <!-- 消息列表 -->
    <MessageList class="px-8" v-if="!screenOrientation" :agentMessageList="agentMessageList" />
    <!-- 横屏出现 -->
    <div v-if="screenOrientation"
      class="flex flex-col flex-1 rounded-l-4xl bg-white/25 p-8 text-2xl font-bold relative">
      <div class="absolute top-0 z-[2] w-full py-4 backdrop-blur-[2px]">
        <h2 class="text-center text-lg">当前对话</h2>
      </div>
      <div ref="scrollRef" class="min-h-[200px] flex-1 overflow-hidden">
        <MessageList class="pt-8 pb-24" :agentMessageList="agentMessageList" />
      </div>
      <div class="absolute bottom-0 z-[2] w-full py-4 backdrop-blur-[2px] flex justify-center">
        <div class="relative">
          <div @touchstart.passive="handleRecorderTouchstart" @touchend.passive="handleRecorderTouchend"
            class="relative z-20 size-[70px] rounded-full bg-linear-to-r from-[#6886fc] to-[#6958fb] flex items-center justify-center">
            <Microphone class="scale-65 relative z-10" />
          </div>
          <div ref="recorderBgRef1"
            class="absolute inset-0 size-[70px] rounded-full bg-black/20 z-10 transition-all duration-300"
            :class="isAnimating ? 'recorder-bg-1' : ''">
          </div>
          <div ref="recorderBgRef2" class="absolute inset-0 size-[70px] rounded-full bg-black/10 z-10"
            :class="isAnimating ? 'recorder-bg-2' : ''">
          </div>
        </div>
      </div>
    </div>
    <!-- 录音 -->
    <Transition v-if="!screenOrientation" name="control" mode="out-in">
      <!--  backdrop-blur-xs -->
      <div class="flex justify-center w-full pb-10 fixed bottom-0 left-[50%] transform-[translateX(-50%)]">
        <div class="relative">
          <div @touchstart.passive="handleRecorderTouchstart" @touchend.passive="handleRecorderTouchend"
            class="relative z-20 size-[70px] rounded-full bg-[#6860ff] flex items-center justify-center">
            <Microphone class="scale-65 relative z-10" />
          </div>
          <div ref="recorderBgRef1"
            class="absolute inset-0 size-[70px] rounded-full bg-black/20 z-10 transition-all duration-300"
            :class="isAnimating ? 'recorder-bg-1' : ''"></div>
          <div ref="recorderBgRef2" class="absolute inset-0 size-[70px] rounded-full bg-black/10 z-10"
            :class="isAnimating ? 'recorder-bg-2' : ''"></div>
        </div>
      </div>
    </Transition>
    <audio @ended="isAudioPlay = false" class="hidden" controls ref="audioPlayRef"></audio>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, watchEffect, nextTick, reactive, watch } from 'vue'
import Examination_0 from '@/assets/image/examination_0.png'
// import Examination_1 from '@/assets/image/examination_1.png'
import Fitness_band_0 from '@/assets/image/fitness_band_0.png'
// import Fitness_band_1 from '@/assets/image/fitness_band_1.png'
import Camera_1 from '@/assets/image/camera_1.png'
import Thermometer_1 from '@/assets/image/thermometer_1.png'
import Navigation_1 from '@/assets/image/navigation_1.png'
import Phone_1 from '@/assets/image/phone_1.png'
import Component from '@/assets/image/component.png'
import Agent_default from '@/assets/image/agent_default.png'
import Agent_medical from '@/assets/image/agent_medical.png'
import Agent_repair from '@/assets/image/agent_repair.png'
import Agent_takeout from '@/assets/image/agent_takeout.png'
import Agent_chat from '@/assets/image/agent_chat.png'

// 工具
import * as THREE from 'three'
import type { AnimationMixer, AnimationAction, Group } from 'three'
import { FBXLoader, OrbitControls } from 'three-stdlib'
import { sendIntent, socketState } from '@/utils/AIOSService'
import { isBase64 } from '@/utils'
import BScroll from '@better-scroll/core'
// 组件
import MessageList from './model/messageList.vue'
import Microphone from '@/assets/svg/microphone.svg'
import Settings from '@/assets/svg/settings.svg'
// import ComponentIcon from '@/assets/svg/component.svg'
import Plus from '@/assets/svg/plus.svg'
// NodeType, CurState, 
import type { Agent, Message, Hardware, Product } from './types'
import { TaskType, IntentType, ProviderType } from './enum'
// dom
const canvasRef = ref<HTMLElement | null>(null)
const recorderBgRef1 = ref<HTMLElement | null>(null)
const recorderBgRef2 = ref<HTMLElement | null>(null)
const audioPlayRef = ref<HTMLAudioElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const pressTimer = ref<number | null>(null)
const isAnimating = ref<boolean>(false)

const isMonitoring = ref<boolean>(true)
// 语音识别结果
const audioAnalyze = ref<string>('')
// 是否播放
const isAudioPlay = ref<boolean>(false)
// 添加一个播放队列和当前播放状态
const isPlaying = ref(false)
const playQueue = reactive<Array<{ text: string }>>([])

// 智能体消息列表
const agentMessageList = reactive<Message[]>([
  {
    text: '欢迎来到智能体，我是你的智能助手',
    type: 'agent',
  },
  {
    text: [
      {
        logo: 'https://aios-storage-public.oss-cn-beijing.aliyuncs.com/images/kfc/spajtb.jpg',
        productContent: '撒大苏打实打实大苏打实打实打算',
        productName: '阿萨大大',
        productPrice: 20
      },
      {
        logo: 'https://aios-storage-public.oss-cn-beijing.aliyuncs.com/images/kfc/spajtb.jpg',
        productContent: '撒大苏打实打实大苏打实打实打算',
        productName: '阿萨大大',
        productPrice: 20
      },
      {
        logo: 'https://aios-storage-public.oss-cn-beijing.aliyuncs.com/images/kfc/spajtb.jpg',
        productContent: '撒大苏打实打实大苏打实打实打算',
        productName: '阿萨大大',
        productPrice: 20
      },
      {
        logo: 'https://aios-storage-public.oss-cn-beijing.aliyuncs.com/images/kfc/spajtb.jpg',
        productContent: '撒大苏打实打实大苏打实打实打算',
        productName: '阿萨大大',
        productPrice: 20
      },
      {
        logo: 'https://aios-storage-public.oss-cn-beijing.aliyuncs.com/images/kfc/spajtb.jpg',
        productContent: '撒大苏打实打实大苏打实打实打算',
        productName: '阿萨大大',
        productPrice: 20
      }
    ],
    type: 'agent',
  }
])

// 硬件列表
const hardwareList = reactive<Hardware[]>([
  {
    name: 'CAMERA',
    icon: Camera_1,
    isActive: false,
  },
  {
    name: 'TEMPERATURE',
    icon: Thermometer_1,
    isActive: false,
  },
  {
    name: 'NAVIGATING',
    icon: Navigation_1,
    isActive: false,
  },
  {
    name: '电话',
    icon: Phone_1,
    isActive: false,
  },
  {
    name: '菜单',
    icon: Component,
    isActive: false,
  }
])
const messageImg = ref<string>('')
// Intent相关
const currentIntentType = ref<IntentType>(IntentType.ASR)
const currentIntentId = ref<string>('')
// 
const bs = ref<BScroll | null>(null)
onMounted(() => {
  // 开启音频媒体流
  handleRecorder()
  // 监听方向变化
  orientationchange()
  // 初始化滚动
  initBScroll()

  setTimeout(() => {
    agentMessageList.push({
      text: [
        {
          logo: 'https://aios-storage-public.oss-cn-beijing.aliyuncs.com/images/kfc/spajtb.jpg',
          productContent: '撒大苏打实打实大苏打实打实打算',
          productName: '阿萨大大',
          productPrice: 20
        },
        {
          logo: 'https://aios-storage-public.oss-cn-beijing.aliyuncs.com/images/kfc/spajtb.jpg',
          productContent: '撒大苏打实打实大苏打实打实打算',
          productName: '阿萨大大',
          productPrice: 20
        },
        {
          logo: 'https://aios-storage-public.oss-cn-beijing.aliyuncs.com/images/kfc/spajtb.jpg',
          productContent: '撒大苏打实打实大苏打实打实打算',
          productName: '阿萨大大',
          productPrice: 20
        },
        {
          logo: 'https://aios-storage-public.oss-cn-beijing.aliyuncs.com/images/kfc/spajtb.jpg',
          productContent: '撒大苏打实打实大苏打实打实打算',
          productName: '阿萨大大',
          productPrice: 20
        },
        {
          logo: 'https://aios-storage-public.oss-cn-beijing.aliyuncs.com/images/kfc/spajtb.jpg',
          productContent: '撒大苏打实打实大苏打实打实打算',
          productName: '阿萨大大',
          productPrice: 20
        }
      ],
      type: 'agent',
    })
  }, 3000);
  // 定义模拟双指滑动的函数
  /* function simulateTwoFingerSwipe(element: any, startPoint1: any, startPoint2: any, endPoint1, endPoint2, duration = 500) {
    // 创建 Touch 对象所需的标识符
    const touchId1 = 0;
    const touchId2 = 1;

    // 1. 创建 touchstart 事件的 Touch 对象
    const touchStart1 = new Touch({
      identifier: touchId1,
      target: element,
      clientX: startPoint1.x,
      clientY: startPoint1.y,
      radiusX: 5, // 接触点X轴半径
      radiusY: 5, // 接触点Y轴半径
      force: 1    // 压力值，通常为1
    });

    const touchStart2 = new Touch({
      identifier: touchId2,
      target: element,
      clientX: startPoint2.x,
      clientY: startPoint2.y,
      radiusX: 5,
      radiusY: 5,
      force: 1
    });

    // 创建 touchstart 事件
    const touchStartEvent = new TouchEvent('touchstart', {
      touches: [touchStart1, touchStart2],
      targetTouches: [touchStart1, touchStart2],
      changedTouches: [touchStart1, touchStart2],
      bubbles: true,
      cancelable: true
    });

    // 分派 touchstart 事件
    element.dispatchEvent(touchStartEvent);

    // 2. 创建一系列 touchmove 事件来模拟滑动过程
    const steps = 20; // 模拟的步骤数，影响平滑度
    const stepDelay = duration / steps; // 每一步的延迟

    for (let i = 0; i <= steps; i++) {
      setTimeout(() => {
        const progress = i / steps; // 当前进度 (0 到 1)

        // 计算当前步骤两个触摸点的位置（线性插值）
        const currentX1 = startPoint1.x + (endPoint1.x - startPoint1.x) * progress;
        const currentY1 = startPoint1.y + (endPoint1.y - startPoint1.y) * progress;
        const currentX2 = startPoint2.x + (endPoint2.x - startPoint2.x) * progress;
        const currentY2 = startPoint2.y + (endPoint2.y - startPoint2.y) * progress;

        // 创建当前步骤的 Touch 对象（用于 touchmove）
        const touchMove1 = new Touch({
          identifier: touchId1,
          target: element,
          clientX: currentX1,
          clientY: currentY1,
          radiusX: 5,
          radiusY: 5,
          force: 1
        });

        const touchMove2 = new Touch({
          identifier: touchId2,
          target: element,
          clientX: currentX2,
          clientY: currentY2,
          radiusX: 5,
          radiusY: 5,
          force: 1
        });

        // 创建 touchmove 事件
        const touchMoveEvent = new TouchEvent('touchmove', {
          touches: [touchMove1, touchMove2],
          targetTouches: [touchMove1, touchMove2],
          changedTouches: [touchMove1, touchMove2],
          bubbles: true,
          cancelable: true
        });

        // 分派 touchmove 事件
        element.dispatchEvent(touchMoveEvent);

        // 如果是最后一步，分发 touchend 事件
        if (i === steps) {
          const touchEnd1 = new Touch({
            identifier: touchId1,
            target: element,
            clientX: endPoint1.x,
            clientY: endPoint1.y,
            radiusX: 5,
            radiusY: 5,
            force: 0 // 力感为0表示手指已抬起
          });

          const touchEnd2 = new Touch({
            identifier: touchId2,
            target: element,
            clientX: endPoint2.x,
            clientY: endPoint2.y,
            radiusX: 5,
            radiusY: 5,
            force: 0
          });

          const touchEndEvent = new TouchEvent('touchend', {
            touches: [],
            targetTouches: [],
            changedTouches: [touchEnd1, touchEnd2], // 注意 touchend 事件中 touches 和 targetTouches 应为空
            bubbles: true,
            cancelable: true
          });

          element.dispatchEvent(touchEndEvent);
        }
      }, stepDelay * i);
    }
  } */

})
watchEffect(async () => {
  try {
    if (!socketState.message) return
    console.log(JSON.parse(socketState.message))
    const { type, msg, id, appName } = JSON.parse(socketState.message)
    // 当接收到不同类型时的处理
    switch (type) {
      case TaskType.TTS:
        // 正则表达式规则，以菜单:`开头，以`结尾
        let arsMessage = ''
        const regex = /菜单:`([^`]+)`/
        const matchMsg = msg.match(regex)?.[1]
        if (matchMsg) {
          const { data } = JSON.parse(matchMsg)
          arsMessage = data.shop.productList.map((product: Product) => {
            const { productName, productPrice } = product
            return `${productName},${productPrice}元`
          }).join('\n')
          handleDialogueList(data.shop.productList)
        } else {
          arsMessage = msg
          handleDialogueList(arsMessage)
        }
        handlePlayQueue(arsMessage)
        break;
      case TaskType.PROVIDER:
        hardwareList.forEach(item => {
          if (ProviderType[item.name as keyof typeof ProviderType] === msg) {
            item.isActive = true
            setTimeout(() => {
              item.isActive = false
            }, 5000);
          }
        })
        break;
      case TaskType.USER:
        currentIntentType.value = IntentType.USERANSWER
        currentIntentId.value = id
        handlePlayQueue(msg).then(() => {
          console.log('开启自动继续说话');
          handleRecorderTouchstart()
          return
          detectVolume()
          startVolumeDetection()
          stopVolumeDetection
        })
        handleDialogueList(msg)
        break
    }
    // 选择智能体
    if (appName) {
      handleAgent(appName)
    }
    // 图片处理
    if (isBase64(msg)) {
      messageImg.value = `data:image/jpeg;base64,${msg}`
      agentMessageList.push({ text: messageImg.value, type: 'agent', img: true })
      console.log('图片--------------------', messageImg.value)
    }
  } catch (error) {
    console.error('不是一个有效的JSON数据', error)
    const p = socketState.message.split(',')
    console.log(p)
  }
})
// 监听消息列表变化
watch(agentMessageList, () => {
  nextTick(() => {
    bs.value?.refresh()
    bs.value?.scrollTo(0, bs.value?.maxScrollY, 300)
  })
})
// 智能体
const agentList: Agent[] = [
  {
    name: '智能体',
    title: '智能体',
    title_1: '我是您的智能体',
    description: 'AIOS 3.0：唤醒硬件，智联万物',
    icon: Agent_default,
    isActive: true,
  },
  {
    name: '发朋友圈',
    title: '社交助手智能体',
    title_1: '我是您的社交助手',
    description: '我可以为你做',
    // description: '通过摄像头进行拍照，通过AI分析照片，并给出发生到的朋友圈文案',
    icon: Agent_chat,
    isActive: false,
  },
  {
    name: '医疗助理',
    title: '医疗助理智能体',
    title_1: '我是您的医疗助理',
    description: '我可以为你做',
    icon: Agent_medical,
    isActive: false,
  },
  {
    name: '点餐助手',
    title: '点餐助手智能体',
    title_1: '我是您的点餐助手',
    // description: '通过语音交流进行点餐，通过AI分析点餐记录，并给出点餐建议',
    description: '我可以为你做',
    icon: Agent_takeout,
    isActive: false,
  },
  {
    name: '车辆健康管家',
    title: '车辆健康智能体',
    title_1: '我是您的车辆健康管家',
    description: '我可以为你做',
    icon: Agent_repair,
    isActive: false,
  },
]
// 当前智能体
const currentAgent = ref<Agent | null>(agentList[0])
// 选择智能体
const handleAgent = (text: string) => {
  const agentFind = agentList.find((v) => v.name === text)
  if (agentFind) {
    currentAgent.value = agentFind
    for (const agent of agentList) {
      agent.isActive = false
    }
    currentAgent.value.isActive = true
    return
    init3DModel()
  }
}
// 屏幕方向
const screenOrientation = ref<number>(screen.orientation.angle)
// 持续监听屏幕方向
const orientationchange = () => {
  window.addEventListener('orientationchange', function () {
    screenOrientation.value = screen.orientation.angle
    nextTick(() => {
      // 先销毁现有的BScroll实例
      if (bs.value) {
        bs.value.destroy()
        bs.value = null
      }
      // 延迟一段时间后重新初始化
      setTimeout(() => {
        initBScroll()
      }, 200)
    })
  });
  window.addEventListener('resize', function () {
    // 当宽度小于高度时，将屏幕方向设置为竖屏
    if (window.innerWidth <= window.innerHeight) {
      screenOrientation.value = 0
    } else {
      screenOrientation.value = 90
    }
  });
}
// 初始化滚动
const initBScroll = () => {
  if (scrollRef.value) {
    bs.value = new BScroll(scrollRef.value, {
      probeType: 3,
      click: true
    })
  }
}
// 初始化3D模型
const init3DModel = () => {
  if (canvasRef.value) {
    // 5. 响应窗口大小变化
    /* window.addEventListener('resize', () => {
      camera.aspect = canvasRef.value.clientWidth / canvasRef.value.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(
        canvasRef.value.clientWidth,
        canvasRef.value.clientHeight
      )
    }) */
    // 1. 初始化场景、相机和渲染器
    const scene = new THREE.Scene()
    scene.background = new THREE.Color() // 背景色

    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.value.clientWidth / canvasRef.value.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 10) // 相机位置
    // 创建纹理
    /*  const textureLoader = new THREE.TextureLoader()
     // 加载纹理图片
     const texturePath = new URL(
       '../../assets/models/Separate_assets_fbx/Textures_4.png', // 替换为你的纹理图片路径
       import.meta.url
     ).href
     const texture = textureLoader.load(texturePath)
     // 创建材质
     const material = new THREE.MeshPhongMaterial({
       map: texture,
       flatShading: true,
     }) */

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(canvasRef.value.clientWidth, canvasRef.value.clientHeight)
    canvasRef.value.appendChild(renderer.domElement)
    // 2. 添加灯光（必需！）
    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff)
    directionalLight.position.set(1, 1, 1).normalize()
    scene.add(directionalLight)
    // 创建统计面板
    /* const stats = new Stats()
    stats.showPanel(0) // 0: FPS, 1: MS, 2: MB
    document.body.appendChild(stats.dom) */
    // 3. 加载 FBX 模型
    const loader = new FBXLoader()
    const clock = new THREE.Clock();
    const mixers: AnimationMixer[] = [];
    let action: AnimationAction | null = null
    const modelsPath = new URL(
      '../../assets/models/healer_anim.fbx',
      import.meta.url
    ).href
    loader.load(
      modelsPath, // 替换为你的FBX文件路径
      (object: Group) => {
        // 模型加载成功后的回调
        object.scale.set(1, 1, 1) // 根据模型大小调整缩放
        object.position.sub({
          x: 0,
          y: 0,
          z: 0,
        })
        object.rotateY(11)
        /* object.traverse((child: any) => {
          child.material = material
        }) */
        // 检查模型是否包含动画
        if (object.animations && object.animations.length > 0) {
          // 创建动画混合器
          const mixer = new THREE.AnimationMixer(object);
          mixers.push(mixer);
          // 播放第一个动画
          action = mixer.clipAction(object.animations[0]);
          action.play();
        }
        scene.add(object)
      },
      (xhr: any) => {
        // 加载进度回调
        ; (xhr.loaded / xhr.total) * 100 + '% loaded'
      },
      (error: any) => {
        // 错误处理
        console.error('FBX加载失败:', error)
      }
    )
    // 4. 动画循环（旋转模型）
    function animate() {
      requestAnimationFrame(animate)
      const delta = clock.getDelta();
      // 更新动画
      mixers.forEach(mixer => {
        mixer.update(delta)
      });
      // scene.rotation.y += 0.01 // 让场景缓慢旋转
      // stats.begin()
      renderer.render(scene, camera)
      // stats.end()
    }
    animate()
    // 相机控制器
    const controls = new OrbitControls(camera, canvasRef.value)
    controls.target.set(0, 0, 0)
    controls.enableZoom = false
    controls.update()
  }
}
// 媒体录音
const mediaRecorder = ref<MediaRecorder | null>(null)
// 音频上下文
const audioContext = ref<AudioContext | null>(null)
// 音频节点
const analyserNode = ref<AnalyserNode | null>(null)
// 处理播放队列
const handlePlayQueue = (msg: string): Promise<void> => {
  // 将播放请求加入队列
  playQueue.push({ text: msg })
  return new Promise((resolve) => {
    // 如果当前没有在播放，则开始处理队列
    if (!isPlaying.value) {
      isPlaying.value = true
      const processQueue = async () => {
        while (playQueue.length > 0) {
          const item = playQueue.shift()
          if (item) {
            await ttsApi(item.text)
          }
        }
        isPlaying.value = false
        resolve()
      }
      processQueue()
    } else {
      // 如果正在播放，则在队列处理完后resolve
      const checkQueue = setInterval(() => {
        if (!isPlaying.value && playQueue.length === 0) {
          clearInterval(checkQueue)
          resolve()
        }
      }, 100)
    }
  })
}
// 处理对话列表
const handleDialogueList = (message: string | Product[]) => {
  if (agentMessageList[agentMessageList.length - 1].loading) {
    agentMessageList[agentMessageList.length - 1] = {
      text: message,
      type: 'agent',
    }
  } else {
    agentMessageList.push({ text: message, type: 'agent' })
  }
}
// 长按录音按钮
const handleRecorderTouchstart = () => {
  // 如果当前是在播放的状态，则暂停播放
  if (audioPlayRef.value && !audioPlayRef.value.paused) {
    audioPlayRef.value.pause()
  }
  pressTimer.value = setTimeout(() => {
    console.log('录音开始')
    isAnimating.value = true
    isMonitoring.value = true
    // 恢复音频上下文
    audioContext.value?.resume().then(() => {
      mediaRecorder.value?.start()
    })
  }, 100)
}
// 移开录音按钮
const handleRecorderTouchend = () => {
  if (pressTimer.value) {
    clearTimeout(pressTimer.value)
    isAnimating.value = false
    isMonitoring.value = false
    mediaRecorder.value?.stop()
    console.log('录音结束')
  }
}
// 处理录音
const handleRecorder = async () => {
  try {
    // 创建音频上下文和AnalyserNode
    audioContext.value = new AudioContext()
    analyserNode.value = audioContext.value.createAnalyser()
    analyserNode.value.fftSize = 256;
    // 获取媒体流
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        // 取消回音
        echoCancellation: true,
        // 降噪
        noiseSuppression: true,
        // 采样率
        // sampleRate: 44100,
      },
    })
    // 创建音频流源
    const source = audioContext.value.createMediaStreamSource(stream)
    source.connect(analyserNode.value)
    // 创建媒体录音
    mediaRecorder.value = new MediaRecorder(stream, {
      mimeType: 'audio/webm;codecs=opus',
      audioBitsPerSecond: 16000,
    })
    let chunks: Blob[] = []
    // 监听录音停止
    mediaRecorder.value.onstop = async () => {
      const blob = new Blob(chunks, { type: mediaRecorder.value?.mimeType })
      // 调用语音识别接口
      const result: string = await arsApi(blob)
      // 语音识别结果
      audioAnalyze.value = result
      agentMessageList.push(
        {
          text: result, type: 'user'
        },
        {
          text: '', type: 'agent', loading: true
        },
      )
      chunks = []
      if (currentIntentType.value === IntentType.ASR) {
        sendIntent(IntentType.ASR, { asrText: result })
      } else if (currentIntentType.value === IntentType.USERANSWER) {
        sendIntent(IntentType.USERANSWER, { userAnswer: result, id: currentIntentId.value })
        // 恢复为ASR
        currentIntentType.value = IntentType.ASR
      }
    }
    // 监听数据可用
    mediaRecorder.value.ondataavailable = (e) => {
      chunks.push(e.data)
    }
  } catch (err) {
    console.error('获取麦克风失败', err)
  }
}
// 在组件的响应式数据中定义
const volumeDetectionState = reactive({
  volumeDetectionRequestId: null as number | null,
  timerId: null as number | null,
  isFirstSentence: false,
  isMonitoring: false // 添加一个控制是否继续监测的标志
});
// 创建一个持续检测音量的函数
const detectVolume = () => {
  if (!analyserNode.value || !volumeDetectionState.isMonitoring) {
    // 如果不需要监测，则停止动画循环
    if (volumeDetectionState.volumeDetectionRequestId) {
      cancelAnimationFrame(volumeDetectionState.volumeDetectionRequestId);
      volumeDetectionState.volumeDetectionRequestId = null;
    }
    return;
  }

  // 说话音量的阈值
  const volume = 30
  // 多少秒没有声音后停止监听
  const timeout = 3000

  const dataArray = new Uint8Array(analyserNode.value.frequencyBinCount);
  analyserNode.value.getByteFrequencyData(dataArray);

  // 计算平均音量
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i];
  }
  const averageVolume = sum / dataArray.length;
  console.log(averageVolume);

  // 音量大于30则认为说过第一句话
  if (averageVolume >= volume && !volumeDetectionState.isFirstSentence) {
    volumeDetectionState.isFirstSentence = true;
    console.log("开始说话，第一个字");
  }

  if (averageVolume >= volume && volumeDetectionState.isFirstSentence && volumeDetectionState.timerId) {
    clearTimeout(volumeDetectionState.timerId);
    volumeDetectionState.timerId = null;
    console.log("继续说话");
  }

  // 音量小于30并且说过第一句话则认为说完了，等待一段时间后关闭监听
  if (averageVolume < volume && volumeDetectionState.isFirstSentence) {
    console.log("没有声音了，等待3秒后取消声音监听");
    if (!volumeDetectionState.timerId) {
      volumeDetectionState.timerId = setTimeout(() => {
        volumeDetectionState.isMonitoring = false;
        if (volumeDetectionState.volumeDetectionRequestId) {
          cancelAnimationFrame(volumeDetectionState.volumeDetectionRequestId);
          volumeDetectionState.volumeDetectionRequestId = null;
        }
        console.log("取消声音监听，调用停止录音函数");
        handleRecorderTouchstart();
      }, timeout);
    }
  }

  // 持续检测 - 在函数内部调用 requestAnimationFrame
  volumeDetectionState.volumeDetectionRequestId = requestAnimationFrame(detectVolume);
};
// 启动音量检测的函数
const startVolumeDetection = () => {
  volumeDetectionState.isMonitoring = true;
  volumeDetectionState.isFirstSentence = false;
  // 清除之前的定时器
  if (volumeDetectionState.timerId) {
    clearTimeout(volumeDetectionState.timerId);
    volumeDetectionState.timerId = null;
  }
  // 开始检测循环
  detectVolume();
};
// 停止音量检测的函数
const stopVolumeDetection = () => {
  volumeDetectionState.isMonitoring = false;
  if (volumeDetectionState.timerId) {
    clearTimeout(volumeDetectionState.timerId);
    volumeDetectionState.timerId = null;
  }
  if (volumeDetectionState.volumeDetectionRequestId) {
    cancelAnimationFrame(volumeDetectionState.volumeDetectionRequestId);
    volumeDetectionState.volumeDetectionRequestId = null;
  }
};
/* const detectVolume = () => {
  if (!analyserNode.value) return;
  // 定义一个变量，用于保存持续检测的请求ID
  let volumeDetectionRequestId: number | null = null
  // 关闭音量监听的定时器ID
  let timerId: number | null = null
  // 是否说了第一句话
  let isFirstSentence: boolean = false;
  // 说话音量的阈值
  const volume = 30
  // 多少秒没有声音后停止监听
  const timeout = 3000
  const dataArray = new Uint8Array(analyserNode.value.frequencyBinCount);
  analyserNode.value.getByteFrequencyData(dataArray);

  // 计算平均音量
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i];
  }
  const averageVolume = sum / dataArray.length;
  console.log(averageVolume);
  // 音量大于30则认为说过第一句话
  if (averageVolume >= volume && !isFirstSentence) {
    isFirstSentence = true;
    console.log("开始说话，第一个字");
  }
  if (averageVolume >= volume && isFirstSentence && timerId) {
    clearTimeout(timerId)
    console.log("继续说话");
  }
  // 音量小于30并且说过第一句话则认为说完了，等待一段时间后关闭监听
  if (averageVolume < volume && isFirstSentence) {
    console.log("没有声音了，等待3秒后取消声音监听");
    timerId = setTimeout(() => {
      cancelAnimationFrame(volumeDetectionRequestId as number)
      console.log("取消声音监听，调用停止录音函数");
      handleRecorderTouchstart()
    }, timeout);
  }
  // 持续检测
  volumeDetectionRequestId = requestAnimationFrame(detectVolume);
}; */
// 语音转文字
const arsApi = async (blob: Blob): Promise<string> => {
  const X_NLS_TOKEN = '23f3c7ff8cd646d198d24ea6ec41b0f0'
  return new Promise<string>((resolve, reject) => {
    fetch('/asr?appkey=YyCBssRoMTulHOyJ', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': blob.size.toString(),
        'X-NLS-Token': X_NLS_TOKEN,
        Host: 'nls-gateway-cn-shanghai.aliyuncs.com',
      },
      body: blob,
    })
      .then((res) => res.json())
      .then(({ result }) => {
        resolve(result as string)
      })
      .catch((err) => {
        console.log('asr调用出错', err);
        reject(err)
      })
  })
}
//语音转文字
const ttsApi = (
  text: string = '今天星期一，天气很好'
): Promise<void> => {
  return new Promise((resolve) => {
    fetch(`/tts?text=${text}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (audioPlayRef.value) {
          audioPlayRef.value.src = location.href + res.file
          // 监听播放完成事件
          const onEnded = () => {
            audioPlayRef.value?.removeEventListener('ended', onEnded)
            console.log('播放完成', new Date().getTime())
            resolve()
          }
          // 监听播放暂停
          const onPause = () => {
            audioPlayRef.value?.removeEventListener('pause', onPause)
            console.log('播放暂停', new Date().getTime())
            resolve()
          }
          audioPlayRef.value.addEventListener('ended', onEnded)
          audioPlayRef.value.addEventListener('pause', onPause)
          audioPlayRef.value.play().catch((e) => {
            console.error('播放失败:', e)
            resolve() // 即使播放失败也继续队列
          })
        } else {
          resolve()
        }
      })
      .catch((error) => {
        console.error('获取音频失败:', error)
        resolve()
      })
  })
}
</script>
<style lang="scss" scoped>
@media (height >=668px) {
  /* .bot-img {
    width: 160px;
  } */
}

.recorder-bg-1 {
  animation: recorderbg1 1s linear infinite;
  animation-delay: 1s;
}

.recorder-bg-2 {
  animation: recorderbg2 1s ease-in infinite;
  animation-delay: 1s;
}

@keyframes recorderbg1 {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes recorderbg2 {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.5);
  }

  100% {
    transform: scale(1);
  }
}

.control-leave-to,
.control-enter-from {
  opacity: 0;
  transform: translateY(100px);
}

.control-leave-active,
.control-enter-active {
  transition: all 0.3s ease;
}

.hander-leave-to,
.hander-enter-from {
  opacity: 0;
}

.hander-leave-active,
.hander-enter-active {
  transition: all 0.3s ease;
}
</style>
