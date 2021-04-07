<template>
  <div class="coachs">
    <!--面包屑导航区-->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>教员管理</el-breadcrumb-item>
      <el-breadcrumb-item>教员列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--视图卡片区-->
    <el-card>
      <!--搜索区-->
      <el-row :gutter="20">
        <!--搜索区:gutter对  el-col设置间隔-->
        <el-col :span="8">
          <!--:span设置宽度-->
          <!--clearable清空输入内容-->
          <el-input placeholder="请输入学员名字" v-model="queryInfo.query" clearable @clear="getUserList">
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
        <el-table-column label="姓名" prop="coach" width="160px"></el-table-column>
        <el-table-column label="性别" prop="sex" width="60px"></el-table-column>
        <el-table-column label="账号" prop="coachAccount"></el-table-column>
        <el-table-column label="密码" prop="password"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <!--编辑区-->
        <el-table-column label="操作">
          <!--v-slot="scope"  作用域插槽绑定用于绑定对应的数据-->
          <template v-slot="scope">
            <!--修改按钮-->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.coach)"
            ></el-button>
            <!--删除按钮-->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="removeUserByName(scope.row.coach)"
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
    <el-dialog title="提示" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <!--内容主体区:before-close="handleClose"-->
      <!--addForm数据  addFormRules验证规则-->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="姓名" prop="coach">
          <el-input v-model="addForm.coach"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="radio" @change="getAddFormSex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
      </el-form>
      <!--底部按钮区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑信息对话框-->
    <el-dialog title="修改用户" :visible.sync="editDialogVsible" width="50%" @close="editDialogClose">
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item label="姓名" prop="coach">
          <el-input v-model="editForm.coach"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="radio" @change="getEditFormSex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="mobile">
          <el-input v-model="editForm.coachAccount"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
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
import { set, get } from '@/assets/js/localStorage'
import {
  validatePassword,
  validateEmail,
  validatePhone,
} from '@/assets/js/validate'
export default {
  name: 'Coachs',
  data() {
    return {
      // 所有数据
      users: '',
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
        queryData: '',
      },

      // 查询状态
      inquiry: false,
      // 添加学员信息对话框
      addDialogVisible: false,
      //添加用户的表单数据
      addForm: {
        coach: '',
        sex: '男',
        email: '',
        mobile: '',
        coachAccount: '',
        password: '',
      },
      // 绑定单选框内容
      radio: 1,
      // 添加表单的验证规则
      addFormRules: {
        //添加用户名的规则
        coach: [{ required: true, message: '请输入名字', trigger: 'blur' }],
        email: [{ required: true, validator: validateEmail }],
        mobile: [{ required: true, validator: validatePhone }],
        password: [{ required: true, validator: validatePassword }],
      },
      //  修改对话框的显示和隐藏
      editDialogVsible: false,
      //  编辑对应用户的下标
      userId: '',
      // 修改表单的数据
      editForm: {},
      // 修改表单的验证规则
      editFormRules: {
        coach: [{ required: true, message: '请输入名字', trigger: 'blur' }],
        email: [{ required: true, validator: validateEmail }],
        mobile: [{ required: true, validator: validatePhone }],
        password: [{ required: true, validator: validatePassword }],
      },
    }
  },
  created() {
    this.setCoachData()
    this.getCoachData()
    this.handleSizeChange(this.pagingInfo.pagesize)
  },
  methods: {
    setCoachData() {
      //clear()
      //只有页面第一次执行的时候才触发
      if (get('Coach') == null)
        set('Coach', {
          user: [
            {
              coach: '张三',
              coachAccount: '15868496601',
              mobile: '15868496601',
              password: '123456',
              email: '123456@qq.com',
              sex: '男',
              id: 1,
            },
            {
              coach: '李四',
              coachAccount: '15868498801',
              mobile: '15868498801',
              password: '123456',
              email: '12345688@qq.com',
              sex: '男',
              id: 2,
            },
            {
              coach: '张三1',
              coachAccount: '15867895542',
              mobile: '15867895542',
              password: '123456',
              email: '12345699@qq.com',
              sex: '男',
              id: 3,
            },
            {
              coach: '李四2',
              coachAccount: '1583549965',
              mobile: '1583549965',
              password: '123456',
              email: '12345611@qq.com',
              sex: '女',
              id: 4,
            },
          ],
        })
    },
    // 获取 存入的数据
    getCoachData() {
      var coachDatas = get('Coach')
      //  遍历数组添加 id
      coachDatas.user.forEach((item, n = 0) => {
        item.id = ++n
      })
      this.users = coachDatas.user
      // 数据的数量
      this.pagingInfo.totals = coachDatas.user.length
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
      //  查询时展示数量的处理
      this.shownews = this.changeusers[this.pagingInfo.pagenum - 1]
      //console.log(this.changeusers[this.pagingInfo.pagenum - 1])
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
    getUserList() {
      if (this.queryInfo.query != '') {
        // 对usernam键进行模糊匹配
        var j = this.users.filter((n) => {
          //  n匹配的数组
          return n.coach.includes(this.queryInfo.query)
        })
        // 更新查询后的数组长度 => 数据的数量
        this.pagingInfo.totals = j.length

        var result = []
        for (var i = 0; i < j.length; i += this.pagingInfo.pagesize) {
          result.push(j.slice(i, i + this.pagingInfo.pagesize))
        }
        //console.log(result[this.queryInfo.pagenum-1])
        this.queryInfo.queryData = result
        this.shownews = result[this.pagingInfo.pagenum - 1]
        this.inquiry = true
      } else {
        this.shownews = this.changeusers[this.pagingInfo.pagenum - 1]
        this.totals = this.users.length
        this.inquiry = false
      }
    },
    // 根据选项绑定类型的值 性别
    getAddFormSex() {
      if (this.radio == 1) return (this.addForm.sex = '男')
      return (this.addForm.sex = '女')
    },
    getEditFormSex() {
      if (this.radio == 1) return (this.editForm.sex = '男')
      return (this.editForm.sex = '女')
    },
    // 清空添加对话框
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    //添加学员信息
    addUser() {
      //接收校验结果
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return

        // 添加状态值 和 id
        this.users = get('Coach').user
        var n = this.users.length
        //电话号码作为账号
        this.addForm.coachAccount = this.addForm.mobile
        this.addForm.id = n + 1
        this.users.push(this.addForm)

        set('Coach', {
          user: this.users,
        })
        this.$message.success('添加成功')
        this.addDialogVisible = false
        // 重新获取数据
        this.getCoachData()
        this.handleSizeChange(this.pagingInfo.pagesize)
      })
    },
    // 修改对话框
    showEditDialog(name) {
      this.userId = this.users.map((item) => item.coach).indexOf(name)
      // 如果存在返回其下标值
      if (this.userId != -1) {
        this.editDialogVsible = true
      }
      this.editForm = this.users[this.userId]
    },
    //修改对话框
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    //修改按钮
    editUserInfo() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return
        // 根据下标值进行修改对应的数组对象
        this.users.splice(this.userId, 1, this.editForm)
        //console.log(this.users)
        set('Coach', {
          user: this.users,
        })
        this.$message.success('修改成功')
        this.editDialogVsible = false
        this.getCoachData()
        this.handleSizeChange(this.pagingInfo.pagesize)
      })
    },
    // 删除
    removeUserByName(name) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 获取最新数据，避免删除的是缓存的
          var Coach = get('Coach').user
          // 通过用户名查询到下标进行筛选删除
          this.users = Coach.filter((item) => item.coach != name)
          set('Coach', { user: this.users })
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          this.getCoachData()
          this.handleSizeChange(this.pagingInfo.pagesize)
          // 解决删除页面最后一条数据后，没有数据展示的情况
          if (this.shownews == undefined) window.location.reload()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
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