export interface ChatRequest {
  /** 会话 id，可选；后端用于关联上下文 */
  conversationId?: number
  /** 用户发送的消息文本 */
  message: string
}

/** 流式返回每一块的结构 */
export interface ChatChunk {
  /** 本次增量文本 */
  delta: string
  /** 是否是最后一块 */
  done: boolean
}
