<template>
  <div class="students">
    <!--面包屑导航区-->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学员管理</el-breadcrumb-item>
      <el-breadcrumb-item>学员列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--视图卡片区-->
    <el-card>
      <!--搜索区-->
      <el-row :gutter="20">
        <!--搜索区:gutter对  el-col设置间隔-->
        <el-col :span="8">
          <!--:span设置宽度-->
          <!--clearable清空输入内容-->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加学员</el-button>
        </el-col>
      </el-row>

      <!--用户列表区-->
      <el-table :data="shownews" border stripe>
        <el-table-column label="#" prop="id" width="40px"></el-table-column>
        <el-table-column label="姓名" prop="studentname"></el-table-column>
        <el-table-column label="账号" prop="studentaccount"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <!--编辑区-->
        <el-table-column label="操作">
          <!--v-slot="scope"  作用域插槽绑定用于绑定对应的数据-->
          <template>
            <!--修改按钮-->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            >v-slot="scope" @click="showEditDialog(scope.row.username)"</el-button>
            <!--删除按钮-->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
            >@click="removeUserById(scope.row.username)"</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagingInfo.pagenum"
        :page-sizes="[3, 5, 10]"
        :page-size="pagingInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagingInfo.totals"
      >
        <!--:current-page当前页  :page-size当前的展示数据  :page-sizes选着展示的页面数据-->
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { set, get, clear } from '@/assets/js/localStorage'
import {
  validateUsername,
  validateEmail,
  validatePhone,
} from '@/assets/js/validate'
export default {
  name: 'Students',
  data() {
    return {
      // 所有数据
      users: '',
      // 数据的数量
      totals: '',
      // 渲染到页面的数据
      shownews: '',
      //展示页面所有数据的重组[[],[]]
      changeusers: '',
      //分页数据
      pagingInfo: {
        pagesize: 3,
        pagenum: 1,
        totals: '',
      },
      //查询数据
      queryInfo: {
        query: '',
      },
      // 添加学员信息对话框
      addDialogVisible: false,
      // 查询状态
      inquiry: false,
    }
  },
  created() {
    this.setStudentData()
    this.getStudentData()
    this.handleSizeChange(this.pagingInfo.pagesize)
  },
  methods: {
    // 存入 数据到浏览器
    setStudentData() {
      //clear()
      //只有页面第一次执行的时候才触发
      if (get('Student') == null)
        set('Student', {
          user: [
            {
              studentname: '张三',
              studentaccount: '15868496601',
              mobile: '15868496601',
              password: '123456',
              email: '123456@qq.com',
              id: 1,
            },
            {
              studentname: '李四',
              studentaccount: '15868498801',
              mobile: '15868498801',
              password: '123456',
              email: '12345688@qq.com',
              id: 2,
            },
            {
              studentname: '张三1',
              studentaccount: '15867895542',
              mobile: '15867895542',
              password: '123456',
              email: '12345699@qq.com',
              id: 3,
            },
            {
              studentname: '李四2',
              studentaccount: '1583549965',
              mobile: '1583549965',
              password: '123456',
              email: '12345611@qq.com',
              id: 4,
            },
          ],
        })
    },
    // 获取 存入的数据
    getStudentData() {
      var studenDatas = get('Student')
      //  遍历数组添加 id
      studenDatas.user.forEach((item, n = 0) => {
        item.id = ++n
      })
      this.users = studenDatas.user
      // 数据的数量
      this.pagingInfo.totals = studenDatas.user.length
    },
    //监听pagesize (展示数据的数量)改变的事件
    handleSizeChange(newSize) {
      this.pagingInfo.pagesize = newSize
      //处理数组，根据pagesize参数来对数组对象重新分组=>[[],[]]
      var result = []
      for (var i = 0; i < this.pagingInfo.totals; i += newSize) {
        result.push(this.users.slice(i, i + newSize))
      }
      this.changeusers = result
      //  console.log(this.changeusers, newSize)
      //this.totals = this.users.length
      //  查询时展示数量的处理
      this.shownews = this.changeusers[this.pagingInfo.pagenum - 1]
      console.log(this.changeusers[this.pagingInfo.pagenum - 1])
      // 当输入框内容不为空
      if (this.inquiry == true) this.getUserList()
    },
    //监听 页码 值改变
    handleCurrentChange(newPage) {
      this.pagingInfo.pagenum = newPage
      this.shownews = this.changeusers[newPage - 1]
      // 根据是否有查询内容进行触发来覆盖没有查询的跳转
      if (this.inquiry == true) this.getUserList()
    },
    // 模糊搜索功能
    getUserList() {},
  },
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  font-size: 14px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
