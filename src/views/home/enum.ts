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
} as const
export type TaskType = (typeof TaskType)[keyof typeof TaskType]

export const providerType = {
  CAMERA: 'device_camera',
  THERMOMETER: 'device_thermometer'
}
export type providerType = (typeof providerType)[keyof typeof providerType]
