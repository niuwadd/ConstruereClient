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
export interface Shop {
  logo: string
  shopName: string
  shopDescription: string
  shopId?: string
}
export interface Restaurant {
  address: string
  logo: string
  storeName: string
  storeId: string
}
type UnionArray<T, U> = Array<T | U>
export type MessageText = string | UnionArray<Product, Shop, Restaurant>
export interface Message {
  text: string | UnionArray<Product, Shop, MessageText>
  type: 'user' | 'agent'
  icon?: string
  token?: string
  messageType?: string
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
