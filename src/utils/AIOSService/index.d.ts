// src/utils/AIOSService/index.d.ts
interface SocketState<T = any> {
  messages: T[]
  isConnected: boolean
  message: string
  // 其他状态属性
}

export declare function sendIntent(type: string, data: any): Promise<void>

export const socketState: SocketState

export declare function initThriftClient(): void

export declare function initStore(): void
