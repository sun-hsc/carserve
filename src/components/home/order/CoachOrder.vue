<template>
  <div class="student-order">
    <!--面包屑导航区-->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>预约管理</el-breadcrumb-item>
      <el-breadcrumb-item>学员预约</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!--搜索区-->
      <el-row :gutter="20">
        <!--搜索区:gutter对  el-col设置间隔-->
        <el-col :span="8">
          <!--:span设置宽度-->
          <!--clearable清空输入内容-->
          <el-input placeholder="请输教员" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加学员</el-button>
        </el-col>
      </el-row>

      <!--用户列表区-->
      <el-table :data="shownews" border stripe>
        <el-table-column label="#" prop width="40px"></el-table-column>
        <el-table-column label="科目" prop></el-table-column>
        <el-table-column label="教员" prop></el-table-column>
        <el-table-column label="日期" prop></el-table-column>
        <el-table-column label="时间段" prop></el-table-column>
        <!--编辑区-->
        <el-table-column label="操作">
          <!--v-slot="scope"  作用域插槽绑定用于绑定对应的数据-->
          <template>
            <!--修改按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!--删除按钮-->
            <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button>
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
import { get, set } from '@/assets/js/localStorage'
import {
  validateUsername,
  validateEmail,
  validatePhone,
} from '@/assets/js/validate'
export default {
  name: 'StudentOrder',
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
  created() {},
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {},
    getUserList() {
      if (this.queryInfo.queryCoach != '') {
        // 对usernam键进行模糊匹配
        var j = this.users.filter((n) => {
          //  n匹配的数组
          return n.coach.includes(this.queryInfo.queryCoach)
        })
        // 更新查询后的数组长度 => 数据的数量
        this.pagingInfo.totals = j.length

        var result = []
        for (var i = 0; i < j.length; i += this.pagingInfo.pagesize) {
          result.push(j.slice(i, i + this.pagingInfo.pagesize))
        }
        //console.log(result)
        this.queryInfo.queryData = result
        this.shownews = result[this.pagingInfo.pagenum - 1]
        this.inquiry = true
      } else {
        this.pagingInfo.totals = this.users.length
        this.inquiry = false
      }
    },
  },
}
</script>

<style lang="less" scoped>
</style>

