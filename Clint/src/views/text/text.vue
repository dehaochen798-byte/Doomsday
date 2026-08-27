<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {//❗坑 onMounted期望接受一个回调函数，dom挂载完成后调用
  console.log('日期:', Date(),'类型：',typeof(Date()))//日期: Thu Aug 27 2026 17:32:24 GMT+0800 (中国标准时间) 类型： string
  console.log('日期:',new Date(),'类型：',typeof(new Date()))//日期: Thu Aug 27 2026 17:32:24 GMT+0800 (中国标准时间) 类型： object

  
})
</script>

<template>
    <!--❗坑 注意引号嵌套 -->
  <router-link :to="{path:'/'}">回到首页</router-link>
</template>
