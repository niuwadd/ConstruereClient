import { reactive } from 'vue'
import type { Message, MessageText } from '../types'
import { MessageType } from '../enum'

export default function useMessageHandler() {
  const agentMessageList = reactive<Message[]>([
    {
      text: 'Construere：唤醒硬件，智联万物',
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
    // console.log('开始校验', message)
    for (const item of regexs) {
      if (message.match(item.regex)?.[1]) {
        console.log('匹配成功', item.type)
        return {
          type: item.type,
          message: message.match(item.regex)?.[1] || '',
        }
      }
    }
    return {
      type: MessageType.TEXT,
      message,
    }
  }

  const handleDialogueList = (message: MessageText, messageType: string) => {
    if (agentMessageList[agentMessageList.length - 1].loading) {
      agentMessageList[agentMessageList.length - 1] = {
        text: message,
        type: 'agent',
        messageType,
      }
    } else {
      agentMessageList.push({ text: message, type: 'agent', messageType })
    }
  }

  return {
    agentMessageList,
    handleTTSMessage,
    handleDialogueList,
  }
}
