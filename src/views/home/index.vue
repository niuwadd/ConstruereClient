<template>
  <div class="bg-[#27214E] size-full px-4 py-8 flex flex-col gap-4">
    <Transition name="hander" mode="out-in">
      <div v-if="isMonitoring" class="text-white flex justify-between">
        <h3 @click="isMonitoring = !isMonitoring">Other faces</h3>
        <div @click="router.push('/chat')" class="text-sm">see all</div>
      </div>
      <div v-else class="text-white flex justify-between">
        <LeftIcon @click="isMonitoring = true" class="fill-white size-[20px]" />
        <h3>Agent</h3>
        <div class="size-[20px]"></div>
      </div>
    </Transition>
    <!-- 角色 -->
    <div>
      <ul class="flex gap-4">
        <li v-for="item in agentList"
          class="size-[50px] rounded-full border-2 border-solid border-black overflow-hidden"
          :class="item.isActive ? 'border-[#ff9E2C]! animate-bounce' : ''">
          <img :src="item.icon" alt="" />
        </li>
      </ul>
    </div>
    <!-- 3d 模型 -->
    <div v-show="isSelectAgent && !isMessageImg" ref="canvasRef" class="flex-1 min-h-[400px] landscape:min-h-[200px]">
    </div>
    <div v-show="isMessageImg || !isSelectAgent"
      class="flex-1 min-h-[400px] landscape:min-h-[200px] flex items-center justify-center">
      <img class="h-full" :src="messageImg" alt="" />
    </div>
    <!-- tooltip -->
    <div v-show="isTooltip && currentAgentMessage && !isMessageImg"
      class="absolute w-[40%] max-h-[50%] bg-white border-2 border-solid border-gray-300 rounded-3xl top-[40%] left-[50%] p-4 z-10">
      <div class="absolute size-[15px] rounded-full bg-white top-[-3px] left-[-3px] z-0"></div>
      <div class="absolute size-[10px] rounded-full bg-white top-[-10px] left-[-10px] z-0"></div>
      <p>{{ currentAgentMessage }}</p>
    </div>
    <div v-if="audioAnalyze" class="text-white text-center text-xl w-full whitespace-break-spaces">
      {{ audioAnalyze }}
    </div>
    <!-- 录音 -->
    <Transition name="control" mode="out-in">
      <div v-if="isMonitoring" class="flex justify-center">
        <div class="relative">
          <div @touchstart.passive="handleRecorderTouchstart" @touchend.passive="handleRecorderTouchend"
            class="relative z-20 size-[100px] rounded-full border-8 border-solid border-[#ff9E2C] bg-white flex items-center justify-center">
            <Microphone class="w-[40px] fill-[#ff9E2C] relative z-10" />
          </div>
          <div ref="recorderBgRef1"
            class="absolute inset-0 size-[100px] rounded-full bg-[#ff9e2c]/80 z-10 transition-all duration-300"
            :class="isAnimating ? 'recorder-bg-1' : ''"></div>
          <div ref="recorderBgRef2" class="absolute inset-0 size-[100px] rounded-full bg-[#ff9e2c]/60 z-10"
            :class="isAnimating ? 'recorder-bg-2' : ''"></div>
        </div>
      </div>
      <div v-else class="w-full flex items-center justify-between">
        <div class="flex gap-4">
          <div @click="isOpen = true" class="rounded-full fill-white bg-black/10 p-4">
            <MessageIcon class="size-[20px]" />
          </div>
          <div class="rounded-full fill-white bg-black/10 p-4">
            <MoreIcon class="size-[20px]" />
          </div>
        </div>
        <div class="rounded-full fill-white p-4">
        </div>
        <audio @ended="isAudioPlay = false" class="hidden" controls ref="audioPlayRef"></audio>
      </div>
    </Transition>
    <!-- 消息列表 -->
    <MessageList v-model="isOpen" :agentMessageList="agentMessageList" />
    <!-- 执行工具栏 -->
    <div v-if="currentAgent"
      class="flex flex-col gap-2 items-center p-2 absolute right-0 top-[50%] transform-[translateY(-50%)] bg-black/10 rounded-l-xl">
      <div v-for="item in currentAgent.tool">
        <component :class="item.isActive ? 'fill-white' : ''" class="size-[30px] fill-gray-500" :is="item.icon">
        </component>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, watchEffect, nextTick, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Agent1 from '@/assets/image/agent1.webp'
import Agent2 from '@/assets/image/agent2.webp'
import Agent3 from '@/assets/image/agent3.webp'
import Agent4 from '@/assets/image/agent4.webp'
// import Loading from '@/assets/image/loading.gif'
// three.js
import * as THREE from 'three'
import type { AnimationMixer, AnimationAction, Group } from 'three'
import { FBXLoader, OrbitControls } from 'three-stdlib'
import { svg } from 'animejs';
// import Stats from 'three/examples/jsm/libs/stats.module.js'
import { sendIntent, socketState } from '@/utils/AIOSService'
import { isBase64 } from '@/utils'
// 组件
import MessageList from './model/messageList.vue'
import Microphone from '@/assets/svg/microphone.svg'
import MoreIcon from '@/assets/svg/more.svg'
import LeftIcon from '@/assets/svg/left.svg'
import MessageIcon from '@/assets/svg/message-comments-fill.svg'
import CameraIcon from '@/assets/svg/camera-fill.svg'
import ThermometerIcon from '@/assets/svg/thermometer.svg'
import BloodPressureIcon from '@/assets/svg/blood-pressure.svg'
import BloodSugarIcon from '@/assets/svg/blood-sugar.svg'
// NodeType, CurState, 
import type { Agent, Message } from './types'
import { TaskType } from './enum'
const router = useRouter()
// dom
const canvasRef = ref<HTMLElement | null>(null)
const recorderBgRef1 = ref<HTMLElement | null>(null)
const recorderBgRef2 = ref<HTMLElement | null>(null)
const audioPlayRef = ref<HTMLAudioElement | null>(null)
//
const pressTimer = ref<number | null>(null)
const isAnimating = ref<boolean>(false)
// 媒体录音
const mediaRecorder = ref<MediaRecorder | null>(null)
// 音频上下文
const audioContext = ref<AudioContext | null>(null)
// 音频节点
const analyserNode = ref<AnalyserNode | null>(null)
const isMonitoring = ref<boolean>(true)
// 语音识别结果
const audioAnalyze = ref<string>('')
// 是否播放
const isAudioPlay = ref<boolean>(false)
// 添加一个播放队列和当前播放状态
const isPlaying = ref(false)
const playQueue = reactive<Array<{ text: string }>>([])
// 智能体
const agentList: Agent[] = [
  {
    name: '小A',
    icon: Agent1,
    byword: 'test',
    isActive: false,
  },
  {
    name: '小B',
    icon: Agent2,
    byword: '医疗',
    isActive: false,
    tool: [
      {
        byword: 'camera',
        icon: CameraIcon,
        isActive: false,
      },
      {
        byword: 'thermometer',
        icon: ThermometerIcon,
        isActive: false,
      },
      {
        byword: '血压',
        icon: BloodPressureIcon,
        isActive: false,
      },
      {
        byword: '血糖',
        icon: BloodSugarIcon,
        isActive: false,
      }
    ],
  },
  {
    name: '小C',
    icon: Agent3,
    byword: 'test',
    isActive: false,
  },
  {
    name: '小D',
    icon: Agent4,
    byword: 'test',
    isActive: false,
  },
]
const isSelectAgent = ref<boolean>(false)
// 当前智能体
const currentAgent = ref<Agent | null>()
// 当前智能体消息
const currentAgentMessage = ref<string>('')
// 智能体消息列表
const agentMessageList = reactive<Message[]>([
])
// 是否显示消息框
const isTooltip = ref<boolean>(false)
const messageImg = ref<string>('')
const isMessageImg = ref<boolean>(false)
const isOpen = ref<boolean>(false)
onMounted(() => {
  // 开启音频媒体流
  handleRecorder()
})
watchEffect(async () => {
  try {
    if (!socketState.message) return
    console.log(socketState.message)
    const { type, msg } = JSON.parse(socketState.message)
    if (type === TaskType.TTS) {
      // 没有选择智能体时触发
      if (!currentAgent.value) {
        // 选择智能体
        handleAgent(msg)
      }
      // 将播放请求加入队列
      playQueue.push({ text: msg })
      // 如果当前没有在播放，则开始处理队列
      if (!isPlaying.value) {
        isPlaying.value = true
        while (playQueue.length > 0) {
          const item = playQueue.shift()
          if (item) {
            currentAgentMessage.value = item.text
            agentMessageList.push({ text: item.text, type: 'agent' })
            // 每次播放前先取消图片显示
            isMessageImg.value = false
            await handleAudioPlay(item.text)
          }
        }
        isPlaying.value = false
      }
    }
    if (type === TaskType.PROVIDER) {
      if (currentAgent.value?.tool) {
        for (const toolItem of currentAgent.value?.tool) {
          if (msg.includes(toolItem.byword)) {
            console.log('图标', toolItem);
            toolItem.isActive = true
          }
        }
      }
    }
    try {
      const { output } = JSON.parse(msg)
      if (isBase64(output)) {
        messageImg.value = `data:image/jpeg;base64,${output}`
        agentMessageList.push({ text: messageImg.value, type: 'agent', img: true })
        isMessageImg.value = true
        console.log('图片--------------------', messageImg.value)
      }
    } catch (error) {
    }
  } catch (error) {
    console.error('不是一个有效的JSON数据', error)
  }
})
// 选择智能体
const handleAgent = (text: string) => {
  console.log('选择智能体', text)
  const agentFind = agentList.find((v) => text.includes(v.byword))
  currentAgent.value = agentFind ? agentFind : null
  if (currentAgent.value) {
    currentAgent.value.isActive = true
    isSelectAgent.value = true
    // 3D模型初始化
    nextTick(() => {
      isTooltip.value = true
      init3DModel()
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
    scene.background = new THREE.Color(0x27214e) // 背景色

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
// 长按录音按钮
const handleRecorderTouchstart = () => {
  pressTimer.value = setTimeout(() => {
    console.log('录音开始')
    isAnimating.value = true
    isMonitoring.value = true
    mediaRecorder.value?.start()
    // 恢复音频上下文
    audioContext.value?.resume()
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
    // 录制中 一直开启
    /* setInterval(() => {
      if (mediaRecorder.value?.state === 'recording') {
        mediaRecorder.value.stop()
      }
    }, 5000) */
    // 监听录音停止
    mediaRecorder.value.onstop = () => {
      const blob = new Blob(chunks, { type: mediaRecorder.value?.mimeType })
      // 生成一个可以播放的音频文件
      /* const url = URL.createObjectURL(blob)
      if (audioPlayRef.value) {
        audioPlayRef.value.src = url
      } */
      // 调用语音识别接口
      const X_NLS_TOKEN = '23f3c7ff8cd646d198d24ea6ec41b0f0'
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
          // 语音识别结果
          audioAnalyze.value = result
          agentMessageList.push({ text: result, type: 'user' })
          chunks = []
          sendIntent('asr', { asrText: result })
        })
    }
    // 监听数据可用
    mediaRecorder.value.ondataavailable = (e) => {
      chunks.push(e.data)
    }
  } catch (err) {
    console.error('获取麦克风失败', err)
  }
}
//
const handleAudioPlay = (
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
          audioPlayRef.value.addEventListener('ended', onEnded)
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
