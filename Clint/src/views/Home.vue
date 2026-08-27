<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'

interface ChatMessage {
  id: number
  role: 'me' | 'other'
  content: string
  time: string
}

interface Conversation {
  id: number
  name: string
  avatar: string
  messages: ChatMessage[]
}

const now = () =>
  new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })

const conversations = ref<Conversation[]>([
  {
    id: 1,
    name: '聊天助手',
    avatar: 'AI',
    messages: [
      { id: 1, role: 'other', content: '你好，这里是聊天演示页面。', time: '09:00' },
      { id: 2, role: 'me', content: '收到，样式我来优化一下。', time: '09:01' },
    ],
  },
  {
    id: 2,
    name: '产品讨论组',
    avatar: '产',
    messages: [
      { id: 1, role: 'other', content: '需求文档我发到群里了。', time: '昨天' },
    ],
  },
  {
    id: 3,
    name: '张三',
    avatar: '张',
    messages: [
      { id: 1, role: 'other', content: '晚点一起吃饭？', time: '周一' },
    ],
  },
])

const activeId = ref(conversations.value[0].id)
const draft = ref('')
const listRef = ref<{ scrollTo: (options: ScrollToOptions) => void } | null>(null)
let nextId = 100

const activeConversation = computed(
  () => conversations.value.find((c) => c.id === activeId.value)!,
)

const messages = computed(() => activeConversation.value.messages)

// 会话列表里展示的最后一条消息预览
const previewOf = (c: Conversation) =>
  c.messages.length ? c.messages[c.messages.length - 1].content : '暂无消息'

const scrollToBottom = async () => {
  await nextTick()
  // n-layout-content 暴露 scrollTo；用足够大的 top 直接贴到底部
  listRef.value?.scrollTo({ top: 1e9 })
}

const selectConversation = (id: number) => {
  if (id === activeId.value) return
  activeId.value = id
  draft.value = ''
  scrollToBottom()
}

const send = () => {
  const text = draft.value.trim()
  if (!text) return
  activeConversation.value.messages.push({
    id: nextId++,
    role: 'me',
    content: text,
    time: now(),
  })
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
  <n-layout has-sider class="chat">
    <!-- 左侧：会话列表 -->
    <n-layout-sider
      bordered
      :width="260"
      content-class="chat__sidebar"
    >
      <div class="chat__sidebar-title">会话</div>
      <ul class="conv-list">
        <li
          v-for="conv in conversations"
          :key="conv.id"
          class="conv"
          :class="{ 'conv--active': conv.id === activeId }"
          @click="selectConversation(conv.id)"
        >
          <div class="conv__avatar">{{ conv.avatar }}</div>
          <div class="conv__info">
            <span class="conv__name">{{ conv.name }}</span>
            <span class="conv__preview">{{ previewOf(conv) }}</span>
          </div>
        </li>
      </ul>
    </n-layout-sider>

    <!-- 右侧：聊天主区 -->
    <n-layout content-class="chat__main">
      <!-- 顶部：会话信息 -->
      <n-layout-header bordered class="chat__header">
        <div class="chat__avatar chat__avatar--brand">
          {{ activeConversation.avatar }}
        </div>
        <div class="chat__peer">
          <span class="chat__peer-name">{{ activeConversation.name }}</span>
          <span class="chat__peer-status">
            <span class="chat__dot"></span>
            在线
          </span>
        </div>
        <router-link :to="{path:'/text'}" class="chat__nav">前往测试页</router-link>
      </n-layout-header>

      <!-- 中部：消息流 -->
      <n-layout-content
        ref="listRef"
        class="chat__body"
        :native-scrollbar="true"
      >
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
      </n-layout-content>

      <!-- 底部：输入区 -->
      <n-layout-footer bordered class="chat__footer">
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
      </n-layout-footer>
    </n-layout>
  </n-layout>
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
  height: 100vh;
}

// n-layout-sider 的内容容器：纵向排列，标题固定、列表滚动
:deep(.chat__sidebar) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

// 右侧 n-layout 的内容容器：纵向三段布局
:deep(.chat__main) {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: $bg-page;
}

.chat {
  &__sidebar-title {
    height: 64px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding: 0 20px;
    font-size: 15px;
    font-weight: 600;
    color: $text-main;
    border-bottom: 1px solid $border;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 64px;
    flex-shrink: 0;
    padding: 0 24px;
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

  &__nav {
    margin-left: auto;
    font-size: 13px;
    color: $brand;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
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

  // n-layout-content 是滚动区域，占据剩余高度
  &__body {
    flex: 1;
    min-height: 0;
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

.conv-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  margin: 0;
  padding: 8px;
  list-style: none;
}

.conv {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease;

  & + & {
    margin-top: 2px;
  }

  &:hover {
    background: #f2f3f5;
  }

  &--active {
    background: rgba($brand, 0.1);

    &:hover {
      background: rgba($brand, 0.1);
    }

    .conv__name {
      color: $brand;
    }
  }

  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 50%;
    font-size: 14px;
    font-weight: 500;
    background: #e5e7eb;
    color: #4b5563;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__name {
    font-size: 14px;
    font-weight: 500;
    color: $text-main;
  }

  &__preview {
    font-size: 12px;
    color: $text-muted;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
