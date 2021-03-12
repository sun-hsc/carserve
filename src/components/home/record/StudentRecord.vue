<template>
  <div class="student-record">
    <!--面包屑导航区-->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>预约记录</el-breadcrumb-item>
      <el-breadcrumb-item>学员预约记录</el-breadcrumb-item>
    </el-breadcrumb>

    <!--视图卡片区-->
    <el-card>
      <!--搜索区-->
      <el-row :gutter="20">
        <!--搜索区:gutter对  el-col设置间隔-->
        <el-col :span="8">
          <!--:span设置宽度-->
          <!--clearable清空输入内容-->
          <el-input placeholder="请输学员姓名" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="shownews" border stripe>
        <!--border边框 stripe隔行变色  -->
        <el-table-column label="#" prop="id" width="40px"></el-table-column>
        <el-table-column label="学员姓名" prop="studentName"></el-table-column>
        <el-table-column label="科目二教练" prop="coach2"></el-table-column>
        <el-table-column label="科目二记录"></el-table-column>
        <el-table-column label="科目三教练" prop="coach3"></el-table-column>
        <el-table-column label="科目三记录"></el-table-column>
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
import { set, get } from '@/assets/js/localStorage'
export default {
  name: 'StudentRecord',
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
      //  查询
      queryInfo: {
        // 查询内容
        query: '',
        // 查询的数据
        queryData: '',
      },
    }
  },
  created() {
    this.setRecord()
    this.getStudentRecord()
    this.handleSizeChange(this.pagingInfo.pagesize)
  },
  methods: {
    setRecord() {
      //只有页面第一次执行的时候才触发
      if (get('Record') == null)
        set('Record', {
          student: [
            {
              studentName: '张三',
              coach2: 'daa2',
              time2: [1],
              coach3: 'daa3',
              time3: [1],
              id: 1,
            },
            {
              studentName: '李四',
              coach2: 'dab2',
              time2: [1],
              coach3: 'dab3',
              time3: [1],
              id: 2,
            },
            {
              studentName: '张三2',
              coach2: 'dac2',
              time2: [1],
              coach3: 'dac3',
              time3: [1],
              id: 3,
            },
            {
              studentName: '李四2',
              coach2: 'dae2',
              time2: [1],
              coach3: 'dae3',
              time3: [1],
              id: 4,
            },
          ],
        })
    },
    // 获取 存入的数据
    getStudentRecord() {
      var studentRecord = get('Record')
      //  遍历数组添加 id
      studentRecord.student.forEach((item, n = 0) => {
        item.id = ++n
      })
      this.users = studentRecord.student
      // 数据的数量
      this.pagingInfo.totals = studentRecord.student.length
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
    handleCurrentChange() {
      this.pagingInfo.pagenum = newPage
      this.shownews = this.changeusers[newPage - 1]
      // 根据是否有查询内容进行触发来覆盖没有查询的跳转
      if (this.inquiry == true) this.getUserList()
    },
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