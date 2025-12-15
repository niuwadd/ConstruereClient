import { ShowRightType } from '@/types/enum'
import type { Message } from '../types/types'
import { defineStore } from 'pinia'
// import { router } from '@/main'
/* interface Message {
  msg: string
  id?: string
  token?: string
  messageType?: string
  type: TaskType
} */
interface showRightMessage extends Message {
  srType: ShowRightType
  imageUrl: string
  content: string
  nodeTitle: string
  token: string
  tokenId: string
}
interface Agent {
  appName: string
  id: string
  isAnswer: boolean
  list?: Message[]
}
interface showRightAgent extends Agent {
  list: showRightMessage[]
}
export const useMessageStore = defineStore('message', {
  state: () => ({
    // 当前是否正在运行agent
    currentAgentRun: false as boolean,
    // 开启的agent列表
    messageList: [
     /*  {
        appName: '医疗助理',
        id: '1',
        isAnswer: true,
        list: [
          {
            text: 'Construere：Unlock Your Hardware，Connect Everything',
            msg: 'Construere：Unlock Your Hardware，Connect Everything',
            type: 'agent',
          },
          {
            text: 'ChatGPT：Unlock Your Hardware，Connect Everything',
            msg: 'ChatGPT：Unlock Your Hardware，Connect Everything',
            type: 'agent',
          },
          {
            text: 'ChatGPT：Unlock Your Hardware，Connect Everything',
            msg: 'ChatGPT：Unlock Your Hardware，Connect Everything',
            type: 'agent',
          },
          {
            text: 'ChatGPT：Unlock Your Hardware，Connect Everything',
            msg: 'ChatGPT：Unlock Your Hardware，Connect Everything',
            type: 'user',
          },
          {
            text: 'ChatGPT：Unlock Your Hardware，Connect Everything',
            msg: 'ChatGPT：Unlock Your Hardware，Connect Everything',
            type: 'agent',
          },
        ],
      },
      {
        appName: '车辆健康管家',
        id: '2',
        isAnswer: false,
        list: [
          {
            text: 'ChatGPT：Unlock Your Hardware，Connect Everything',
            msg: 'ChatGPT：Unlock Your Hardware，Connect Everything',
            type: 'agent',
          },
        ],
      },
      {
        appName: '智能助手',
        id: '3',
        isAnswer: false,
        list: [
          {
            text: 'ChatGPT：Unlock Your Hardware，Connect Everything',
            msg: 'ChatGPT：Unlock Your Hardware，Connect Everything',
            type: 'agent',
          },
        ],
      },
      {
        appName: '智能助手',
        id: '4',
        isAnswer: false,
        list: [
          {
            text: 'ChatGPT：Unlock Your Hardware，Connect Everything',
            msg: 'ChatGPT：Unlock Your Hardware，Connect Everything',
            type: 'agent',
          },
        ],
      },
      {
        appName: '智能助手',
        id: '5',
        isAnswer: false,
        list: [
          {
            text: 'ChatGPT：Unlock Your Hardware，Connect Everything',
            msg: 'ChatGPT：Unlock Your Hardware，Connect Everything',
            type: 'agent',
          },
        ],
      },
      {
        appName: '智能助手',
        id: '5',
        isAnswer: false,
        list: [
          {
            text: 'ChatGPT：Unlock Your Hardware，Connect Everything',
            msg: 'ChatGPT：Unlock Your Hardware，Connect Everything',
            type: 'agent',
          },
        ],
      },
      {
        appName: '智能助手',
        id: '5',
        isAnswer: false,
        list: [
          {
            text: 'ChatGPT：Unlock Your Hardware，Connect Everything',
            msg: 'ChatGPT：Unlock Your Hardware，Connect Everything',
            type: 'agent',
          },
        ],
      } */
    ] as Agent[],
    // 后台提醒类列表(token列表)
    backgroundTokens: [] as string[],
    // 当前消息
    currentMessage: null as Message | null,
    // 显示的right数据
    showRightData: [] as showRightAgent[],
    // 当前显示的right数据
    currentShowRigthData: null as showRightMessage | null,
    // 基础消息(非agent消息)
    baseMessageList: [] as Message[],
    // 当前基础消息
    currentBaseMessage: null as Message | null,
    isSingleaAgent: false as boolean,
    isMultipleAgent: false as boolean,
    // 当前token
    currentDoneToken: null as string | null,
  }),
  actions: {
    addMessage(message: Message, id: string, isAnswer: boolean = false) {
      const messageFind = this.messageList.find((item) => item.id === id)
      const messageMerge = { ...message, isAnswer }
      if (messageFind && messageFind.appName) {
        // console.log('当前消息-----------', messageMerge)
        messageFind.list?.push(messageMerge)
        this.currentMessage = { ...messageMerge }
      } else {
        this.baseMessageList.push(messageMerge)
        this.currentBaseMessage = { ...messageMerge }
      }
    },
    addShowRightData(message: showRightMessage, id: string) {
      const messageFind = this.showRightData.find((item) => item.id === id)
      if (messageFind) {
        messageFind.list.push({
          ...message,
          tokenId: (message.id ?? '') + (message.token ?? ''),
        })
        this.currentShowRigthData = {
          ...message,
          tokenId: (message.id ?? '') + (message.token ?? ''),
        }
      }
    },
    addApp(appName: string, id: string) {
      const messageFind = this.messageList.find(
        (item) => item.appName === appName
      )
      if (messageFind) {
        messageFind.id = id
      } else {
        this.messageList.push({
          appName,
          id,
          isAnswer: false,
          list: [],
        })
      }

      this.showRightData.push({
        appName,
        id,
        isAnswer: false,
        list: [],
      })
    },
    addBackground(token: string) {
      this.backgroundTokens.push(token)
    },
    clearMessage(id: string) {
      console.log('清除流程数据', id, this.messageList)
      const clearMessageFind = this.messageList.findIndex(
        (item) => item.id === id
      )
      if (clearMessageFind != -1) {
        this.messageList.splice(clearMessageFind, 1)
        this.currentDoneToken = id
        /* router.replace({
          query: {},
        }) */
        console.log('流程完毕，清除流程数据', this.messageList)
      }
    },
  },
})
