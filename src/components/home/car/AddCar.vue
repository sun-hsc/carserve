<template>
  <div class="add-car">
    <!--面包屑导航区-->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>车辆管理</el-breadcrumb-item>
      <el-breadcrumb-item>车辆信息列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加车辆信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!--视图卡片区-->
    <el-card></el-card>
  </div>
</template>

<script>
export default {
  name: 'AddCar',
  data() {
    return {
      // 所有数据
      users: '',
      // 渲染到页面的数据
      shownews: '',
      //展示页面所有数据的重组[[],[]]
      changeUsers: '',
      //分页数据
      pagingInfo: {
        pagesize: 3,
        pagenum: 1,
        totals: '',
      },
      //  查询
      queryInfo: {
        query: '',
        queryData: '',
      },
    }
  },
  created() {},
  methods: {
    getUserList() {},
  },
}
</script>

<style lang="less" scoped>
</style>