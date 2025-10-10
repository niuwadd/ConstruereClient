import { ref } from 'vue'

export default function useAgent() {
  const agentList: any[] = [
    // 原来的 agentList 数据
  ]
  
  const currentAgent = ref<any | null>(agentList[0])
  
  const handleAgent = () => {
    // 原来的 handleAgent 实现
  }
  
  return {
    agentList,
    currentAgent,
    handleAgent
  }
}