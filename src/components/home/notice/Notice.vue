<template>
  <div class="notice">
    <!--面包屑导航区-->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公告管理</el-breadcrumb-item>
      <el-breadcrumb-item>公告管理列表</el-breadcrumb-item>
    </el-breadcrumb>
    教员提醒学员预约练车公告待开发
  </div>
</template>

<script>
export default {
  name: 'Notice'
}
</script>

<style lang="less" scoped></style>
