import type { ChatChunk, ChatRequest } from './types'

/** 模拟回复语料，根据用户消息给出不同片段 */
const MOCK_REPLIES: Record<string, string[]> = {
  default: [
    '好的，',
    '我来帮你',
    '分析一下',
    '这个问题。\n\n',
    '首先，',
    '需要考虑',
    '几个关键点：\n',
    '1. 数据的来源\n',
    '2. 处理的逻辑\n',
    '3. 最终的输出\n\n',
    '如果有更多细节，',
    '欢迎继续提问。',
  ],
}

/**
 * 模拟流式响应。
 * 每隔 intervalMs 毫秒 yield 一个文本块，全部发完后 yield done:true。
 */
export async function* mockStreamChat(
  req: ChatRequest,
  intervalMs = 120,
): AsyncGenerator<ChatChunk> {
  // 简单关键词匹配，找不到就用 default
  const key =
    Object.keys(MOCK_REPLIES).find((k) => k !== 'default' && req.message.includes(k)) ?? 'default'
  const chunks = MOCK_REPLIES[key]

  for (let i = 0; i < chunks.length; i++) {
    await sleep(intervalMs)
    yield { delta: chunks[i], done: false }
  }

  yield { delta: '', done: true }
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))
