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
} as const
export type TaskType = (typeof TaskType)[keyof typeof TaskType]

export const ProviderType = {
  CAMERA: 'take_one_photo',
  TEMPERATURE: 'take_body_temperature',
  HEART_ARTE: 'take_body_heart_rate',
  NAVIGATING: 'use_baidu_navigating',
} as const
export type ProviderType = (typeof ProviderType)[keyof typeof ProviderType]

export const IntentType = {
  ASR: 'asr',
  USERANSWER: 'userAnswer',
} as const
export type IntentType = (typeof IntentType)[keyof typeof IntentType]
