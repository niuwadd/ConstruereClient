export interface Agent {
  name: string
  icon: string
  byword: string
  isActive: boolean
  tool?: {
    byword: string
    icon: string
    isActive: boolean
  }[]
}
export interface Message {
  text: string
  type: 'user' | 'agent'
  img?: boolean
}
