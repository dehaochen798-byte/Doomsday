<script setup lang="ts">
import { nextTick, ref } from 'vue'

interface ChatMessage {
  id: number
  role: 'me' | 'other'
  content: string
  time: string
}

const now = () =>
  new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })

const messages = ref<ChatMessage[]>([
  { id: 1, role: 'other', content: '你好，这里是聊天演示页面。', time: now() },
  { id: 2, role: 'me', content: '收到，样式我来优化一下。', time: now() },
])
const draft = ref('')
const listRef = ref<HTMLElement | null>(null)
let nextId = 3

const scrollToBottom = async () => {
  await nextTick()
  const el = listRef.value
  if (el) el.scrollTop = el.scrollHeight
}

const send = () => {
  const text = draft.value.trim()
  if (!text) return
  messages.value.push({ id: nextId++, role: 'me', content: text, time: now() })
  draft.value = ''
  scrollToBottom()
}

// Enter 发送，Shift+Enter 换行
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}
</script>

<template>
  <div class="chat">
    <!-- 顶部：会话信息 -->
    <header class="chat__header">
      <div class="chat__avatar chat__avatar--brand">AI</div>
      <div class="chat__peer">
        <span class="chat__peer-name">聊天助手</span>
        <span class="chat__peer-status">
          <span class="chat__dot"></span>
          在线
        </span>
      </div>
    </header>

    <!-- 中部：消息流 -->
    <main ref="listRef" class="chat__body">
      <div class="chat__list">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="msg"
          :class="`msg--${msg.role}`"
        >
          <div class="msg__avatar">{{ msg.role === 'me' ? '我' : 'AI' }}</div>
          <div class="msg__main">
            <div class="msg__bubble">{{ msg.content }}</div>
            <span class="msg__time">{{ msg.time }}</span>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部：输入区 -->
    <footer class="chat__footer">
      <div class="chat__composer">
        <n-input
          v-model:value="draft"
          type="textarea"
          class="chat__input"
          placeholder="输入消息，Enter 发送，Shift+Enter 换行"
          :autosize="{ minRows: 1, maxRows: 5 }"
          @keydown="onKeydown"
        />
        <n-button
          type="primary"
          size="large"
          :disabled="!draft.trim()"
          @click="send"
        >
          发送
        </n-button>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
$brand: #18a058;
$border: #ebebeb;
$text-main: #1f2937;
$text-muted: #9ca3af;
$bg-page: #f7f8fa;
$radius-bubble: 16px;
$max-width: 768px;

.chat {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: $bg-page;

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 64px;
    flex-shrink: 0;
    padding: 0 24px;
    background: #fff;
    border-bottom: 1px solid $border;
  }

  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    font-size: 13px;
    font-weight: 600;

    &--brand {
      background: $brand;
      color: #fff;
    }
  }

  &__peer {
    display: flex;
    flex-direction: column;
  }

  &__peer-name {
    font-size: 14px;
    font-weight: 600;
    color: $text-main;
  }

  &__peer-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: $text-muted;
  }

  &__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: $brand;
  }

  &__body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: $max-width;
    margin: 0 auto;
    padding: 24px;
  }

  &__footer {
    flex-shrink: 0;
    padding: 16px 24px;
    background: #fff;
    border-top: 1px solid $border;
  }

  &__composer {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    max-width: $max-width;
    margin: 0 auto;
  }

  &__input {
    flex: 1;
  }
}

.msg {
  display: flex;
  align-items: flex-end;
  gap: 10px;

  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    border-radius: 50%;
    font-size: 12px;
    font-weight: 500;
    background: #e5e7eb;
    color: #4b5563;
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-width: 75%;
  }

  &__bubble {
    padding: 10px 16px;
    border-radius: $radius-bubble;
    font-size: 14px;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
    background: #fff;
    color: $text-main;
  }

  &__time {
    padding: 0 4px;
    font-size: 11px;
    color: $text-muted;
  }

  // 对方消息：左对齐
  &--other {
    flex-direction: row;

    .msg__main {
      align-items: flex-start;
    }

    .msg__bubble {
      border-bottom-left-radius: 4px;
    }
  }

  // 我方消息：右对齐
  &--me {
    flex-direction: row-reverse;

    .msg__avatar {
      background: $brand;
      color: #fff;
    }

    .msg__main {
      align-items: flex-end;
    }

    .msg__bubble {
      background: $brand;
      color: #fff;
      border-bottom-right-radius: 4px;
    }
  }
}
</style>
