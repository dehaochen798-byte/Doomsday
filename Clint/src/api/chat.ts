import type { ChatChunk, ChatRequest } from './types'
import { mockStreamChat } from './mock'

/**
 * 真实流式请求实现（生产环境使用）。
 * 用 fetch 发起 POST，读取服务端返回的 text/event-stream，
 * 逐行解析 SSE 协议后转成 AsyncGenerator<ChatChunk> 供调用方消费。
 */
async function* realStreamChat(req: ChatRequest): AsyncGenerator<ChatChunk> {
  const resp = await fetch('/api/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })

  if (!resp.ok || !resp.body) {
    throw new Error(`请求失败：${resp.status}`)
  }

  // getReader() 拿到一个字节流读取器，每次 read() 返回一个 Uint8Array 块
  const reader = resp.body.getReader()
  // TextDecoder 把二进制块解码成字符串；stream:true 表示跨块的多字节字符不会被截断
  const decoder = new TextDecoder()
  // buf 用来拼接跨网络包的不完整行
  let buf = ''

  while (true) {
    const { value, done } = await reader.read()
    // 服务端关闭连接时 done 为 true，退出循环
    if (done) break
    // 将本次字节块追加到缓冲区
    buf += decoder.decode(value, { stream: true })

    // 按换行符切割；最后一段可能不完整，留回 buf 等下次拼接
    const lines = buf.split('\n')
    buf = lines.pop() ?? ''

    for (const line of lines) {
      const trimmed = line.trim()
      // 跳过空行和非 data 行（SSE 协议中注释行以 : 开头，事件行以 event: 开头等）
      if (!trimmed || !trimmed.startsWith('data:')) continue
      const json = trimmed.slice(5).trim()
      // OpenAI 兼容协议在流结束时发送 data: [DONE]
      if (json === '[DONE]') {
        yield { delta: '', done: true }
        return
      }
      try {
        const chunk = JSON.parse(json) as ChatChunk
        yield chunk
      } catch {
        // 忽略无法解析的行（心跳包、空 data 等）
      }
    }
  }
}

/**
 * 对外唯一入口。
 * 开发环境（import.meta.env.DEV）走本地 mock，无需启动后端即可调试；
 * 生产环境走 realStreamChat，接入真实服务端。
 * 调用方只依赖这个函数，切换环境无需改任何业务代码。
 */
export function streamChat(req: ChatRequest): AsyncGenerator<ChatChunk> {
  if (import.meta.env.DEV) {
    return mockStreamChat(req)
  }
  return realStreamChat(req)
}