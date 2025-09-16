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
type UnionArray<T, U> = Array<T | U>
export type MessageText = string | UnionArray<Product, Shop>
export interface Message {
  // text: string | any[]
  text: string | UnionArray<Product, Shop>
  type: 'user' | 'agent'
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
