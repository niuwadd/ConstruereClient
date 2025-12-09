import { reactive } from 'vue'
import type { Message, MessageText } from '../types/types'
import { MessageType } from '../types/enum'
export default function useMessageHandler() {
  return (t?: (key: string) => {}) => {
    const agentMessageList = reactive<Message[]>([
      {
        text: `${
          t ? t('agent.default.description') : 'agent.default.description'
        }`,
        type: 'agent',
      },
    ])
    /**
     * 处理TTS消息
     * @param message 待处理的消息
     * @returns 处理后的消息
     */
    const handleTTSMessage = (
      message: string
    ): { message: string; type: MessageType } => {
      let messageData: { message: string; type: MessageType } = {
        message: message,
        type: MessageType.TEXT,
      }
      const regexs = [
        {
          type: MessageType.HTML,
          regex: /html```\s*([\s\S]*?)```/,
        },
        {
          type: MessageType.MARKDOWN,
          regex: /markdown```\s*([\s\S]*?)```/,
        },
        /* {
      type: MessageType.JSON,
      regex: /[\u4e00-\u9fff]+```([^`]+)```/
    }, */
        {
          type: MessageType.JSON_RESTAURANT,
          regex: /饭店```([^`]+)```/,
        },
        {
          type: MessageType.JSON_RESTAURANT_X,
          regex: /餐厅```([^`]+)```/,
        },
        {
          type: MessageType.JSON_MENU,
          regex: /菜单```([^`]+)```/,
        },
        {
          type: MessageType.USER,
          regex: /user```([^`]+)```/,
        },
        {
          type: MessageType.WEATHER,
          regex: /weather```([^`]+)```/,
        },
      ]
      for (const item of regexs) {
        if (message.match(item.regex)?.[1]) {
          messageData = {
            type: item.type,
            message: message.match(item.regex)?.[1] || '',
          }
          break
        }
      }
      return messageData
    }

    const handleDialogueList = (
      message: MessageText,
      messageType: string,
      id: string,
      token: string
    ) => {
      if (agentMessageList[agentMessageList.length - 1].loading) {
        agentMessageList[agentMessageList.length - 1] = {
          text: message,
          type: 'agent',
          messageType,
          id,
          token,
        }
      } else {
        agentMessageList.push({
          text: message,
          type: 'agent',
          messageType,
          id,
          token,
        })
      }
    }
    const handleUserMessage = (message: string) => {
      agentMessageList.push(
        {
          text: message,
          type: 'user',
        },
        {
          text: '',
          type: 'agent',
          loading: true,
        }
      )
    }
    return {
      agentMessageList,
      handleTTSMessage,
      handleDialogueList,
      handleUserMessage,
    }
  }
}
