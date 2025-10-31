import { ref } from 'vue'
import * as THREE from 'three'
import type { AnimationMixer, AnimationAction, Group } from 'three'
import { FBXLoader, OrbitControls } from 'three-stdlib'
import type { Agent } from '../types'
import { AppName } from '../enum'
import Agent_default from '@/assets/image/agent_default.png'
import Agent_medical from '@/assets/image/agent_medical.png'
import Agent_repair from '@/assets/image/agent_repair.png'
import Agent_takeout from '@/assets/image/agent_takeout.png'
import Agent_chat from '@/assets/image/agent_chat.png'
export default function useAgent() {
  const canvasRef = ref<HTMLElement | null>(null)
  const agentList: Agent[] = [
    {
      name: '智能体',
      title: '智能体',
      title_1: '我是您的智能体',
      description: 'Construere：唤醒硬件，智联万物',
      icon: Agent_default,
      isActive: true,
    },
    {
      name: AppName.CHAT,
      title: '社交助手智能体',
      title_1: '我是您的社交助手',
      description: '我可以为你做',
      // description: '通过摄像头进行拍照，通过AI分析照片，并给出发生到的朋友圈文案',
      icon: Agent_chat,
      isActive: false,
    },
    {
      name: AppName.MEDICAL,
      title: '医疗助理智能体',
      title_1: '我是您的医疗助理',
      description: '我可以为你做',
      icon: Agent_medical,
      isActive: false,
    },
    {
      name: AppName.TAKEOUT,
      title: '点餐助手智能体',
      title_1: '我是您的点餐助手',
      // description: '通过语音交流进行点餐，通过AI分析点餐记录，并给出点餐建议',
      description: '我可以为你做',
      icon: Agent_takeout,
      isActive: false,
    },
    {
      name: AppName.REPAIR,
      title: '车辆健康智能体',
      title_1: '我是您的车辆健康管家',
      description: '我可以为你做',
      icon: Agent_repair,
      isActive: false,
    },
  ]

  const currentAgent = ref<any | null>(agentList[0])
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
      renderer.setSize(
        canvasRef.value.clientWidth,
        canvasRef.value.clientHeight
      )
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
      const clock = new THREE.Clock()
      const mixers: AnimationMixer[] = []
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
            const mixer = new THREE.AnimationMixer(object)
            mixers.push(mixer)
            // 播放第一个动画
            action = mixer.clipAction(object.animations[0])
            action.play()
          }
          scene.add(object)
        },
        (xhr: any) => {
          // 加载进度回调
          ;(xhr.loaded / xhr.total) * 100 + '% loaded'
        },
        (error: any) => {
          // 错误处理
          console.error('FBX加载失败:', error)
        }
      )
      // 4. 动画循环（旋转模型）
      function animate() {
        requestAnimationFrame(animate)
        const delta = clock.getDelta()
        // 更新动画
        mixers.forEach((mixer) => {
          mixer.update(delta)
        })
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
  const handleAgent = (text: string) => {
    const agentFind = agentList.find((v) => v.name === text)
    if (agentFind) {
      currentAgent.value = agentFind
    } else {
      currentAgent.value = agentList[0]
    }
    for (const agent of agentList) agent.isActive = false
    currentAgent.value.isActive = true
    return
    init3DModel()
  }

  return {
    agentList,
    currentAgent,
    handleAgent,
  }
}
