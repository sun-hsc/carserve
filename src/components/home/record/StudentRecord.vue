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
          <el-input
            placeholder="请输学员姓名"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加学员记录</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="shownews" border stripe>
        <!--border边框 stripe隔行变色  -->
        <el-table-column label="#" prop="id" width="40px"></el-table-column>
        <el-table-column label="学员姓名" prop="studentName"></el-table-column>
        <el-table-column label="科目二教练" prop="coach2"></el-table-column>
        <el-table-column label="科目二记录">
          <template v-slot="scope">
            <!--详情按钮-->
            <el-button
              type="primary"
              @click="showDetailsDialog2(scope.row.studentName)"
            >
              <i class="fa fa-file-text-o" aria-hidden="true"></i> 时间记录
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="科二考试" width="100px">
          <template v-slot="scope">
            <!--scope.row  获取当前行的数据-->
            <!--el-switch开关按钮-->
            <el-switch
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="通过"
              v-model="scope.row.testPass2"
              @change="testPass2Change(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="科目三教练" prop="coach3"></el-table-column>
        <el-table-column label="科目三记录">
          <template v-slot="scope">
            <!--详情按钮-->
            <el-button
              type="primary"
              @click="showDetailsDialog3(scope.row.studentName)"
            >
              <i class="fa fa-file-text-o" aria-hidden="true"></i> 时间记录
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="科三考试" width="100px">
          <template v-slot="scope">
            <!--scope.row  获取当前行的数据-->
            <!--el-switch开关按钮-->
            <el-switch
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="通过"
              v-model="scope.row.testPass3"
              @change="testPass3Change(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="禁止预约" width="100px">
          <template v-slot="scope">
            <!--scope.row  获取当前行的数据-->
            <!--el-switch开关按钮-->
            <el-switch
              active-color="#13ce66"
              inactive-color="#ff4949"
              v-model="scope.row.state"
              @change="stateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template v-slot="scope">
            <!--v-slot="scope"  作用域插槽绑定用于绑定对应的数据-->
            <!--修改按钮-->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!--删除按钮-->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="removeUserByName(scope.row.studentName)"
            ></el-button>
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

    <!--添加用户对话框-->
    <!--@close窗口关闭事件-->
    <el-dialog
      title="提示"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        @close="addDialogClose"
        label-width="120px"
      >
        <el-form-item label="学员">
          <el-input v-model="addForm.studentName"></el-input>
        </el-form-item>
        <el-form-item label="科目二教员">
          <el-input v-model="addForm.coach2"></el-input>
        </el-form-item>
        <el-form-item label="科目三教员">
          <el-input v-model="addForm.coach3"></el-input>
        </el-form-item>
      </el-form>
      <!--底部按钮区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑信息对话框-->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVsible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form ref="editFormRef" :model="editForm" label-width="120px">
        <el-form-item label="学员">
          <el-input v-model="editForm.studentName"></el-input>
        </el-form-item>
        <el-form-item label="科目二教员">
          <el-input v-model="editForm.coach2"></el-input>
        </el-form-item>
        <el-form-item label="科目三教员">
          <el-input v-model="editForm.coach3"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVsible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!--科目二详情-->
    <el-dialog
      :title="'科目二预约记录，学员：' + tableTime2.studentName"
      :visible.sync="dialogVisibleTime2"
      width="35%"
    >
      <el-table
        :data="tableTime2.time2"
        border
        style="width: 100%"
        height="350"
      >
        <el-table-column prop="id" label="#" width="60"></el-table-column>
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="inTime" label="时间段"></el-table-column>
        <el-table-column prop="signIn" label="签到"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleTime2 = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisibleTime2 = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!--科目三详情-->
    <el-dialog
      :title="'科目三预约记录，学员：' + tableTime3.studentName"
      :visible.sync="dialogVisibleTime3"
      width="35%"
    >
      <el-table
        :data="tableTime3.time3"
        border
        style="width: 100%"
        height="350"
      >
        <el-table-column prop="id" label="#" width="60"></el-table-column>
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="inTime" label="时间段"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleTime3 = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisibleTime3 = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
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
      changeUsers: '',
      //分页数据
      pagingInfo: {
        pagesize: 3,
        pagenum: 1,
        totals: ''
      },
      //  查询
      queryInfo: {
        query: '',
        queryData: ''
      },
      // 控制添加对话的显示和隐藏
      addDialogVisible: false,
      //添加用户的表单数据
      addForm: {
        studentName: '',
        coach2: '',
        coach3: ''
      },
      //  修改对话框的显示和隐藏
      editDialogVsible: false,
      //  编辑对应用户的下标
      userId: '',
      // 修改表单的数据
      editForm: {},
      // 科目二对话框
      dialogVisibleTime2: false,
      tableTime2: {
        studentName: '',
        time2: '',
        coach2: ''
      },
      // 科目三对话框
      dialogVisibleTime3: false,
      tableTime3: {
        studentName: '',
        time3: '',
        coach3: ''
      }
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
              coach2: '王一',
              time2: [
                { date: '2016-05-03', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-05-04', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-05-05', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-05-06', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-05-07', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-05-08', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-05-03', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-05-04', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-05-05', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-05-06', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-05-07', inTime: '11:00-12:00', signIn: '是' }
              ],
              coach3: '王三',
              time3: [
                { date: '2016-05-03', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-05-04', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-05-05', inTime: '11:00-12:00', signIn: '是' }
              ],
              state: true,
              testPass2: true,
              testPass3: false,
              id: 1
            },
            {
              studentName: '李三',
              coach2: '王二',
              time2: [
                { date: '2016-05-03', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-05-04', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-05-05', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-05-06', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-05-07', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-05-08', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-05-09', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-05-11', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-05-12', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-05-13', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-05-14', inTime: '11:00-12:00', signIn: '是' }
              ],
              coach3: '王三',
              time3: [
                { date: '2016-06-03', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-06-04', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-06-05', inTime: '11:00-12:00', signIn: '是' }
              ],
              state: true,
              testPass2: true,
              testPass3: false,
              id: 2
            },
            {
              studentName: '李一',
              coach2: '王二',
              time2: [
                { date: '2016-05-03', inTime: '9:00-10:00', signIn: '是' },
                { date: '2016-05-04', inTime: '9:00-10:00', signIn: '是' },
                { date: '2016-05-05', inTime: '9:00-10:00', signIn: '是' }
              ],
              coach3: '',
              time3: [],
              state: true,
              testPass2: false,
              testPass3: false,
              id: 3
            },
            {
              studentName: '李四',
              coach2: '王二',
              time2: [
                { date: '2016-05-03', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-05-04', inTime: '11:00-12:00', signIn: '是' },
                { date: '2016-05-05', inTime: '11:00-12:00', signIn: '是' }
              ],
              coach3: '',
              time3: [],
              state: true,
              testPass2: false,
              testPass3: false,
              id: 4
            },
            {
              studentName: '张二',
              coach2: '王二',
              time2: [
                { date: '2016-05-03', inTime: '15:00-16:00', signIn: '是' },
                { date: '2016-05-04', inTime: '15:00-16:00', signIn: '是' },
                { date: '2016-05-05', inTime: '15:00-16:00', signIn: '是' }
              ],
              coach3: '',
              time3: [],
              state: true,
              testPass2: false,
              testPass3: false,
              id: 5
            }
          ]
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
      this.changeUsers = result
      //  console.log(this.changeUsers, newSize)
      //this.totals = this.users.length
      //  查询时展示数量的处理
      this.shownews = this.changeUsers[this.pagingInfo.pagenum - 1]
      //console.log(this.changeUsers[this.pagingInfo.pagenum - 1])
      // 当输入框内容不为空
      if (this.inquiry == true) this.getUserList()
    },
    //监听 页码 值改变
    handleCurrentChange(newPage) {
      this.pagingInfo.pagenum = newPage
      this.shownews = this.changeUsers[newPage - 1]
      // 根据是否有查询内容进行触发来覆盖没有查询的跳转
      if (this.inquiry == true) this.getUserList()
    },
    getUserList() {
      if (this.queryInfo.query != '') {
        // 对usernam键进行模糊匹配
        var j = this.users.filter(n => {
          //  n匹配的数组
          return n.studentName.includes(this.queryInfo.query)
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
    // 科目二详情
    showDetailsDialog2(studentName) {
      var index1 = this.users.map(item => item.studentName).indexOf(studentName)
      var time = this.users[index1].time2
      //添加id记录条数
      time.forEach((item, n = 0) => {
        item.id = ++n
      })
      this.tableTime2.studentName = studentName
      this.tableTime2.time2 = time
      this.tableTime2.coach2 = this.users[index1].coach2
      //console.log(this.tableTime2)
      this.dialogVisibleTime2 = true
    },
    // 科目三详情
    showDetailsDialog3(studentName) {
      var index1 = this.users.map(item => item.studentName).indexOf(studentName)
      var time = this.users[index1].time3
      console.log(index1, studentName, this.users[0])
      //添加id记录条数
      time.forEach((item, n = 0) => {
        item.id = ++n
      })

      this.tableTime3.studentName = studentName
      this.tableTime3.time3 = time
      this.tableTime3.coach3 = this.users[index1].coach3
      //console.log(this.tableTime3)
      this.dialogVisibleTime3 = true
    },
    // 根据学员名字删除记录
    removeUserByName(studentName) {
      console.log(studentName)
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 获取最新数据，避免删除的是缓存的
          var record = get('Record')
          // 通过用户名查询到下标进行筛选删除
          this.users = record.student.filter(
            item => item.studentName != studentName
          )
          set('Record', { student: this.users })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })

          this.getStudentRecord()
          this.handleSizeChange(this.pagingInfo.pagesize)
          // 解决删除页面最后一条数据后，没有数据展示的情况
          if (this.shownews == undefined) window.location.reload()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //监听state状态改变
    stateChange(userinfo) {
      //查询数组中对象的id是否存在，并返回下标值
      var i = this.users.map(item => item.id).indexOf(userinfo.id)
      // 根据数组下标值替换数组的成员
      this.users.splice(i, 1, userinfo)
      //console.log(this.users)
      //修改后保存到浏览器中
      set('Record', {
        student: this.users
      })
      this.$message.success('更新用户状态成功')
    },
    //  重置添加对话框的表单
    addDialogClose() {
      //  对应的表单 addFormRef    清空表单resetFields()
      this.$refs.addFormRef.resetFields()
    },

    // 添加学员记录
    addUser() {
      // 添加状态值 和 id
      var n = this.totals
      this.addForm.state = true
      this.addForm.id = n + 1
      this.users.push(this.addForm)
      set('Record', {
        student: this.users
      })
      // 根据数组长度判定是否成功
      //var data = get('Admin')
      //if (data.user.length > this.totals)
      this.$message.success('添加成功')
      //this.$message.success('添加失败')
      this.addDialogVisible = false
      // 重新获取数据
      this.getStudentRecord()
      this.handleSizeChange(this.pagingInfo.pagesize)
    },
    // 监听修改对话框，关闭时重置
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    showEditDialog(id) {
      this.userId = this.users.map(item => item.id).indexOf(id)
      // 如果存在返回其下标值
      if (this.userId != -1) {
        this.editDialogVsible = true
      }
      this.editForm = this.users[this.userId]
    },
    // 提交修改的表单
    editUserInfo() {
      // 根据下标值进行修改对应的数组对象
      this.users.splice(this.userId, 1, this.editForm)
      //console.log(this.users)
      set('Record', {
        student: this.users
      })
      this.$message.success('修改成功')
      this.editDialogVsible = false
      this.getStudentRecord()
      this.handleSizeChange(this.pagingInfo.pagesize)
    },

    //监听科目二状态改变
    testPass2Change(userinfo) {
      //查询数组中对象的id是否存在，并返回下标值
      var i = this.users.map(item => item.id).indexOf(userinfo.id)
      // 根据数组下标值替换数组的成员
      this.users.splice(i, 1, userinfo)
      //console.log(this.users)
      //修改后保存到浏览器中
      set('Record', {
        student: this.users
      })
      this.$message.success('用户科目二考试状态更新')
    },
    //监听科目三状态改变
    testPass3Change(userinfo) {
      //查询数组中对象的id是否存在，并返回下标值
      var i = this.users.map(item => item.id).indexOf(userinfo.id)
      // 根据数组下标值替换数组的成员
      this.users.splice(i, 1, userinfo)
      //console.log(this.users)
      //修改后保存到浏览器中
      set('Record', {
        student: this.users
      })
      this.$message.success('用户科目三状态更新')
    }
  }
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
