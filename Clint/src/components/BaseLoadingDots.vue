<script setup lang="ts">
/**
 * 通用加载/思考态组件：双方块绕行（cube move）
 * 效果：两个小方块沿一个正方形轨迹相互追逐，边平移边旋转、并在拐角处缩放，
 *       形成经典的 SpinKit "cube-grid/cube-move" 律动。
 * 用法：<BaseLoadingDots />、<BaseLoadingDots :size="24" color="#3cefff" />
 */
import { computed } from 'vue'

interface Props {
  /** 整体容器边长，单位 px（方块与位移距离都会随它按比例缩放） */
  size?: number
  /** 方块颜色 */
  color?: string
  /** 绕行一整轮的时长，单位秒 */
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 40,
  color: '#3cefff',
  duration: 1.8,
})

// 单个方块边长：约为容器的 3/8，与原始 40px→15px 的比例保持一致
const cubeSize = computed(() => Math.round(props.size * 0.375))
// 方块平移距离：容器边长减去方块自身，保证正好贴着对角来回走
const move = computed(() => props.size - cubeSize.value)
// 第二个方块延迟半轮，形成"你追我赶"的错峰效果
const halfDelay = computed(() => -props.duration / 2)
</script>

<template>
  <span
    class="spinner"
    role="status"
    aria-label="加载中"
    :style="{
      '--sp-size': `${size}px`,
      '--sp-cube': `${cubeSize}px`,
      '--sp-move': `${move}px`,
      '--sp-color': color,
      '--sp-duration': `${duration}s`,
      '--sp-delay': `${halfDelay}s`,
    }"
  >
    <span class="cube1"></span>
    <span class="cube2"></span>
  </span>
</template>

<style scoped lang="scss">
// 外层容器：作为两个方块的定位基准
.spinner {
  position: relative;
  width: var(--sp-size);
  height: var(--sp-size);
  display: inline-block;
  vertical-align: middle;
}

// 两个方块：初始都堆叠在左上角，靠动画各自绕正方形轨迹平移
.cube1,
.cube2 {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--sp-cube);
  height: var(--sp-cube);
  background-color: var(--sp-color);
  // 沿正方形四角平移 + 旋转 + 拐角缩放，循环往复
  animation: sk-cubemove var(--sp-duration) infinite ease-in-out;
}

// 第二个方块延迟半轮出发，与第一个隔开对角，形成相互追逐
.cube2 {
  animation-delay: var(--sp-delay);
}

// 绕行轨迹：右 → 右下 → 下 → 回到原点，同时反向旋转一圈
// 50% / 50.1% 之间刻意断开 1deg，避免部分浏览器把 -180deg 优化成不旋转
@keyframes sk-cubemove {
  25% {
    transform: translateX(var(--sp-move)) rotate(-90deg) scale(0.5);
  }
  50% {
    transform: translateX(var(--sp-move)) translateY(var(--sp-move)) rotate(-179deg);
  }
  50.1% {
    transform: translateX(var(--sp-move)) translateY(var(--sp-move)) rotate(-180deg);
  }
  75% {
    transform: translateX(0) translateY(var(--sp-move)) rotate(-270deg) scale(0.5);
  }
  100% {
    transform: rotate(-360deg);
  }
}
</style>
