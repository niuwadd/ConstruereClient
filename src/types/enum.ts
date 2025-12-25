export const NodeType = {
  START: 'start',
  END: 'end',
  TOOL: 'tool',
  LLM: 'llm',
} as const
export type NodeType = (typeof NodeType)[keyof typeof NodeType]

export const CurState = {
  START: 'START',
  RUNNING: 'RUNNING',
  END: 'END',
} as const
export type CurState = (typeof CurState)[keyof typeof CurState]

export const TaskType = {
  TTS: 'TTS',
  NODE: 'NODE_EXECUTE_TASK',
  PROVIDER: 'PROVIDER',
  USER: 'GET_USER_ANSWER',
  SHOWR: 'SHOW_RIGHT',
  APP: 'MAIN_FIND_APP',
  DONE: 'DONE',
} as const
export type TaskType = (typeof TaskType)[keyof typeof TaskType]

export const ProviderType = {
  CAMERA: 'take_one_photo',
  TEMPERATURE: 'take_body_temperature',
  HEART_ARTE: 'take_body_heart_rate',
  NAVIGATING: 'use_baidu_navigating',
  CARSTATE: 'get_car_one_state',
} as const
export type ProviderType = (typeof ProviderType)[keyof typeof ProviderType]

export const IntentType = {
  ASR: 'asr',
  USERANSWER: 'userAnswer',
  GREETINGS: 'greetings',
  LANGUAGE: 'language',
  MODETYPE: 'modeType',
  BACKGROUNDRUNNING: 'backgroundRunning',
  STOPALLWORKFLOW: 'stopAllWorkflow',
} as const
export type IntentType = (typeof IntentType)[keyof typeof IntentType]

export const MessageType = {
  TEXT: 'text',
  IMAGE: 'image',
  MARKDOWN: 'markDown',
  HTML: 'html',
  JSON: 'json',
  JSON_MENU: 'jsonMenu',
  JSON_RESTAURANT: 'jsonRestaurant',
  JSON_RESTAURANT_X: 'jsonRestaurantX',
  USER: 'user',
  WEATHER: 'weather',
} as const
export type MessageType = (typeof MessageType)[keyof typeof MessageType]

export const AppName = {
  TAKEOUT: '外卖助手',
  MEDICAL: '医疗助理',
  REPAIR: '车辆健康管家',
  CHAT: '发朋友圈',
  BACKGROUND: '后台提醒',
  GREETINGS: 'greetings',
}
export type AppName = (typeof AppName)[keyof typeof AppName]

export const ShowRightType = {
  IMAGE: 'image',
  NAVIGATE: 'navigate',
  MUSIC: 'music',
  RESTAURANT: 'restaurant',
  DINNER: 'dinner',
  MENU: 'menu',
}
export type ShowRightType = (typeof ShowRightType)[keyof typeof ShowRightType]

export const modeType = {
  AIOSMODE: 'AIosMode',
  AGENTICMODE: 'AgenticMode',
}
export type modeType = (typeof modeType)[keyof typeof modeType]
