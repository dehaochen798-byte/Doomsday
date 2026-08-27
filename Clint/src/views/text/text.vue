<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {//❗坑 onMounted期望接受一个回调函数，dom挂载完成后调用
  console.log('日期', Date())
})
</script>

<template>
  <router-link :to="{path:'/'}">回到首页</router-link>//❗坑 注意引号嵌套
</template>
