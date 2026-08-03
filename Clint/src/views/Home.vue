<template>
    <n-layout has-sider style="height: 100vh;">
        <n-layout-sider bordered content-style="padding: 16px;">
            侧边栏
        </n-layout-sider>
        <n-layout>
            <n-layout-header bordered content-style="padding: 16px;">
                标题
            </n-layout-header>
            <n-layout-content content-style="padding: 16px;">
                <router-view></router-view>
            </n-layout-content>
        </n-layout>
    </n-layout>
</template>

<style scoped>

</style>
/**
 * ### 使用n-layout布局样式失效
 * 删除项目自带多余style-css样式文件
 *
 * ### content-style不提示补全
 * tsconfig.app.json的type里引入"naive-ui/volar"
 * 
 * ### 多个router-view同一页面使用
 * 命名视图
 *
 * 
 */
