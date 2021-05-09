<template>
  <div class="coach-order">
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
        <el-col :span="6">
          <!--:span设置宽度-->
          <!--clearable清空输入内容-->
          <el-input
            placeholder="请输学员名字"
            v-model="queryInfo.queryStudent"
            clearable
            @clear="getStudentList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getStudentList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-input
            placeholder="请输教员名字"
            v-model="queryInfo.queryCoach"
            clearable
            @clear="getCoachList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getCoachList"
            ></el-button>
          </el-input>
        </el-col>
        <!--改变展示科目的数据-->
        <el-col :span="2">
          <el-button type="success" circle @click="changeSubjectData"
            >科目切换</el-button
          >
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加预约</el-button
          >
        </el-col>
      </el-row>

      <!--用户列表区-->
      <el-table :data="shownews" border stripe>
        <el-table-column label="#" prop="id" width="40px"></el-table-column>
        <el-table-column label="学员" prop="studentName"></el-table-column>
        <el-table-column label="科目" prop="time2"></el-table-column>
        <el-table-column label="教员" prop="coach"></el-table-column>
        <el-table-column label="日期" prop="date"></el-table-column>
        <el-table-column label="时间段" prop="inTime"></el-table-column>
        <!--编辑区-->
        <el-table-column label="操作">
          <!--v-slot="scope"  作用域插槽绑定用于绑定对应的数据-->
          <template v-slot="scope">
            <!--v-slot="scope"  作用域插槽绑定用于绑定对应的数据-->
            <!--修改按钮-->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.studentName)"
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

    <el-dialog
      title="添加预约"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!--内容主体区:before-close="handleClose"-->
      <!--addForm数据  addFormRules验证规则-->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="80px"
      >
        <el-form-item label="学员名字" prop="studentName">
          <el-input v-model="addForm.studentName"></el-input>
        </el-form-item>
        <el-form-item label="教员名字" prop="coach">
          <el-input v-model="addForm.coach"></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-input v-model="addForm.date"></el-input>
        </el-form-item>
        <!--时间段下拉列表-->
        <el-form-item label="时间段">
          <el-select v-model="inTime" @change="getInTime">
            <el-option
              v-for="item in inTimeOptions"
              :key="item.inTime"
              :label="item.label"
              :value="item.inTime"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!--底部按钮区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrder">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑信息对话框-->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVsible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
      >
        <el-form-item label="学员名字" prop="studentName">
          <el-input v-model="editForm.studentName"></el-input>
        </el-form-item>
        <el-form-item label="教员名字" prop="coach">
          <el-input v-model="editForm.coach"></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-input v-model="editForm.date"></el-input>
        </el-form-item>
        <!--时间段下拉列表-->
        <el-form-item label="时间段">
          <el-select v-model="inTime" @change="getInTime">
            <el-option
              v-for="item in inTimeOptions"
              :key="item.inTime"
              :label="item.label"
              :value="item.inTime"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVsible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { get, set } from '@/assets/js/localStorage'
import { validateDate } from '@/assets/js/validate'
import {
  validateUsername,
  validateEmail,
  validatePhone
} from '@/assets/js/validate'
export default {
  name: 'CoachOrder',
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
        totals: ''
      },
      //查询数据
      queryInfo: {
        queryStudent: '',
        queryCoach: ''
      },
      // 查询状态
      inquiry: false,
      // 科目数据切换状态
      subjectDatas: 2,
      // 控制添加对话的显示和隐藏
      addDialogVisible: false,
      //添加用户的表单数据
      addForm: {
        studentName: '',
        date: '',
        inTime: '',
        coach: ''
      },
      // 添加表单的验证规则
      addFormRules: {
        date: [{ required: true, validator: validateDate }],
        coach: [{ required: true, message: '请输教员名', trigger: 'blur' }],
        studentName: [
          { required: true, message: '请输学员名', trigger: 'blur' }
        ]
      },
      // 绑定下拉列表
      inTimeOptions: [
        {
          label: '8:00-9:00',
          inTime: '8:00-9:00'
        },
        {
          label: '9:00-10:00',
          inTime: '9:00-10:00'
        },
        {
          label: '10:00-11:00',
          inTime: '10:00-11:00'
        },
        {
          label: '11:00-12:00',
          inTime: '11:00-12:00'
        },
        {
          label: '14:00-15:00',
          inTime: '14:00-15:00'
        },
        {
          label: '15:00-16:00',
          inTime: '15:00-16:00'
        },
        {
          label: '16:00-17:00',
          inTime: '16:00-17:00'
        },
        {
          label: '17:00-18:00',
          inTime: '17:00-18:00'
        }
      ],
      inTime: '8:00-9:00',
      //  修改对话框的显示和隐藏
      editDialogVsible: false,
      //  编辑对应用户的id
      userId: '',
      // 修改表单的数据
      editForm: {},
      // 修改表单的验证规则
      editFormRules: {
        date: [{ required: true, validator: validateDate }],
        coach: [{ required: true, message: '请输教员名', trigger: 'blur' }],
        studentName: [
          { required: true, message: '请输学员名', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.setStudentOrder()
    this.getOrderStudent(this.subjectDatas)
    this.handleSizeChange(this.pagingInfo.pagesize)
  },
  methods: {
    setStudentOrder() {
      if (get('Order') == null)
        set('Order', {
          student2: [
            {
              studentName: '张一',
              time2: '科目二',
              date: '2016-05-03',
              inTime: '14:00-15:00',
              coach: '王一',
              id: 1
            },
            {
              studentName: '张二',
              time2: '科目二',
              date: '2016-05-03',
              inTime: '9:00-10:00',
              coach: '王一',
              id: 1
            },
            {
              studentName: '李四',
              time2: '科目二',
              date: '2016-05-03',
              inTime: '15:00-16:00',
              coach: '王一',
              id: 2
            },
            {
              studentName: '李一',
              time2: '科目二',
              date: '2016-05-03',
              inTime: '15:00-16:00',
              coach: '王二',
              id: 3
            }
          ],
          student3: [
            {
              studentName: '张三',
              time2: '科目三',
              date: '2016-05-03',
              inTime: '14:00-15:00',
              coach: '王三',
              id: 1
            },
            {
              studentName: '李三',
              time2: '科目三',
              date: '2016-05-03',
              inTime: '15:00-16:00',
              coach: '王三',
              id: 2
            }
          ]
        })
    },
    getOrderStudent(subjectDatas) {
      if (subjectDatas == 2) {
        var studenDatas = get('Order').student2
      } else {
        var studenDatas = get('Order').student3
      }
      //  遍历数组添加 id
      studenDatas.forEach((item, n = 0) => {
        item.id = ++n
      })
      this.users = studenDatas
      this.pagingInfo.totals = studenDatas.length
    },
    handleSizeChange(newSize) {
      this.pagingInfo.pagesize = newSize
      //处理数组，根据pagesize参数来对数组对象重新分组=>[[],[]]
      var result = []
      for (var i = 0; i < this.pagingInfo.totals; i += newSize) {
        result.push(this.users.slice(i, i + newSize))
      }
      this.changeusers = result
      //  查询时展示数量的处理
      this.shownews = this.changeusers[this.pagingInfo.pagenum - 1]
      // 当输入框内容不为空
      if (this.inquiry == true) {
        this.getStudentList()
        this.getCoachList()
      }
    },
    handleCurrentChange(newPage) {
      this.pagingInfo.pagenum = newPage
      this.shownews = this.changeusers[newPage - 1]
      // 根据是否有查询内容进行触发来覆盖没有查询的跳转
      if (this.inquiry == true) {
        this.getStudentList()
        this.getCoachList()
      }
    },
    // 学员模糊查询
    getStudentList() {
      if (this.queryInfo.queryStudent != '') {
        // 对usernam键进行模糊匹配
        var j = this.users.filter(n => {
          return n.studentName.includes(this.queryInfo.queryStudent)
        })
        // 更新查询后的数组长度 => 数据的数量
        this.pagingInfo.totals = j.length

        var result = []
        for (var i = 0; i < j.length; i += this.pagingInfo.pagesize) {
          result.push(j.slice(i, i + this.pagingInfo.pagesize))
        }
        this.queryInfo.queryData = result
        this.shownews = result[this.pagingInfo.pagenum - 1]
        this.inquiry = true
      } else {
        var result = []
        var j = this.pagingInfo.pagesize
        for (var i = 0; i < this.pagingInfo.totals; i += j) {
          result.push(this.users.slice(i, i + j))
        }
        this.shownews = this.changeusers[this.pagingInfo.pagenum - 1]
        this.pagingInfo.totals = this.users.length
        this.inquiry = false
      }
    },
    // 教员模糊查询
    getCoachList() {
      if (this.queryInfo.queryCoach != '') {
        // 对usernam键进行模糊匹配
        var j = this.users.filter(n => {
          return n.coach.includes(this.queryInfo.queryCoach)
        })
        // 更新查询后的数组长度 => 数据的数量
        this.pagingInfo.totals = j.length

        var result = []
        for (var i = 0; i < j.length; i += this.pagingInfo.pagesize) {
          result.push(j.slice(i, i + this.pagingInfo.pagesize))
        }
        this.queryInfo.queryData = result
        this.shownews = result[this.pagingInfo.pagenum - 1]
        this.inquiry = true
      } else {
        this.shownews = this.changeusers[this.pagingInfo.pagenum - 1]
        this.pagingInfo.totals = this.users.length
        this.inquiry = false
      }
    },
    // 科目数据展示切换
    changeSubjectData() {
      if (this.subjectDatas == 2) {
        this.subjectDatas = 3
      } else {
        this.subjectDatas = 2
      }
      this.getOrderStudent(this.subjectDatas)
      this.handleSizeChange(this.pagingInfo.pagesize)
    },
    // 改变下拉列表选项
    getInTime() {
      if (this.addDialogVisible == true) {
        this.addForm.inTime = this.inTime
      } else {
        this.editForm.inTime = this.inTime
      }
    },
    //  重置添加对话框的表单
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    //添加预约
    addOrder() {
      if (this.subjectDatas == 2) {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) return this.$refs.error('请填写完整的信息！')
          // 执行添加的的功能
          var datas = get('Order')
          this.addForm.id = datas.student2.length + 1
          this.addForm.time2 = '科目二'
          datas.student2.push(this.addForm)
          //console.log(datas)
          var student2 = datas.student2
          var student3 = datas.student3
          set('Order', { student2, student3 })
          this.$message.success('信息添加成功')
        })
        this.addDialogVisible = false
      } else {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) return this.$refs.error('请填写完整的信息！')
          // 执行添加的的功能
          var datas = get('Order')
          this.addForm.id = datas.student3.length + 1
          this.addForm.time3 = '科目三'
          datas.student3.push(this.addForm)
          //console.log(datas)
          var student2 = datas.student2
          var student3 = datas.student3
          set('Order', { student2, student3 })
          this.$message.success('信息添加成功')
        })
        this.addDialogVisible = false
      }
    },
    // 修改按钮对话框
    showEditDialog(name) {
      // 通过id查询到下标
      this.userId = this.users.map(item => item.studentName).indexOf(name)
      // 如果存在返回其下标值
      if (this.userId != -1) {
        this.editDialogVsible = true
      }
      this.editForm = this.users[this.userId]
      // 修改下拉列表的默认值
      this.inTime = this.users[this.userId].inTime
    },
    // 监听修改对话框，关闭时重置
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 提交修改的表单
    editUserInfo() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        // 根据下标值进行修改对应的数组对象
        this.users.splice(this.userId, 1, this.editForm)
        var datas = get('Order')
        // 判断修改的是科目二还是科目三
        if (this.subjectDatas == 2) {
          datas.student2 = this.users
        } else {
          datas.student3 = this.users
        }
        var student2 = datas.student2
        var student3 = datas.student3
        set('Order', { student2, student3 })
        this.$message.success('信息添加成功')

        this.editDialogVsible = false
        this.getOrderStudent(this.subjectDatas)
        this.handleSizeChange(this.pagingInfo.pagesize)
      })
    },
    // 删除
    removeUserByName(name) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 获取最新数据，避免删除的是缓存的
          var datas = get('Order')
          // 判断删除的是科目二还是科目三
          if (this.subjectDatas == 2) {
            // 通过用户名查询到下标进行筛选删除
            var student2 = datas.student2.filter(
              item => item.studentName != name
            )
            var student3 = datas.student3
          } else {
            var student3 = datas.student3.filter(
              item => item.studentName != name
            )
            var student2 = datas.student2
          }
          set('Order', { student2, student3 })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getOrderStudent(this.subjectDatas)
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
