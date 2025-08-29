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
  img?: boolean
  loading?: boolean
}
export interface Hardware {
  name: string
  icon: string
  isActive: boolean
}
