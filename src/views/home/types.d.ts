export interface Agent {
  name: string
  title: string
  title_1: string
  description: string
  icon: string
  isActive: boolean
  tool?: {
    byword: string
    icon: string
    isActive: boolean
  }[]
}
export interface Product {
  logo: string
  productContent: string
  productName: string
  productPrice: number
  productId?: string
}
export interface Message {
  text: string | Array<Product>
  type: 'user' | 'agent'
  messageType?: string
  img?: boolean
  loading?: boolean
}
interface HardwareData {
  type: string
  value: string
}
export interface Hardware {
  name: string
  icon: string
  isActive?: boolean
  data?: HardwareData
}
