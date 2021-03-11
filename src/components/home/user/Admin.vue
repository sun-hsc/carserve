<template>
  <div class="admin">
    <!--面包屑导航区-->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
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
          <el-button type="primary" @click="addDialogVisible = true">添加管理人员</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="info" @click="gotolink">用户账号管理</el-button>
        </el-col>
      </el-row>

      <!--用户列表区-->
      <el-table :data="shownews" border stripe>
        <!--border边框 stripe隔行变色  -->
        <el-table-column label="#" prop="id" width="40px"></el-table-column>
        <el-table-column label="用户" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" width="80px">
          <template v-slot="scope">
            <!--scope.row  获取当前行的数据-->
            <!--el-switch开关按钮-->
            <el-switch v-model="scope.row.state" @change="stateChange(scope.row)"></el-switch>
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
              @click="removeUserById(scope.row.mobile)"
            ></el-button>
            <!--按钮提示  enterable鼠标进入到提示区域后文本隐藏-->
            <el-tooltip effect="dark" content="分配用户账号" placement="top" :enterable="false">
              <!--分配账号-->
              <el-button
                type="warning"
                icon="el-icon-star-off"
                size="mini"
                @click="giveUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totals"
      >
        <!--:current-page当前页  :page-size当前的展示数据  :page-sizes选着展示的页面数据-->
      </el-pagination>
    </el-card>

    <button @click="test">清空locastorage</button>

    <!--添加用户对话框-->
    <!--@close窗口关闭事件-->
    <el-dialog title="提示" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <!--内容主体区:before-close="handleClose"-->
      <!--addForm数据  addFormRules验证规则-->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="角色" prop="role_name">
          <el-input v-model="addForm.role_name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
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
        <el-form-item label="用户">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_name">
          <el-input v-model="editForm.role_name"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVsible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!--分配用户账号对话框-->
    <el-dialog title="分配用户账号" :visible.sync="giveDialogVsible" width="50%" @close="giveDialogClose">
      <el-form ref="giveFormRef" :model="giveForm" label-width="80px">
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="giveForm.username"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="giveDialogVsible = false">取 消</el-button>
        <el-button type="primary" @click="giveUserInfo">确 定</el-button>
      </span>
    </el-dialog>
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
  name: 'Admin',
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
      //  分页跟查询
      queryInfo: {
        //当前页数
        pagenum: 1,
        // 当前每页展示的数据
        pagesize: 3,
        // 查询内容
        query: '',
        // 查询的数据
        queryData: '',
      },
      // 控制添加对话的显示和隐藏
      addDialogVisible: false,
      //添加用户的表单数据
      addForm: {
        role_name: '',
        email: '',
        mobile: '',
      },
      // 添加表单的验证规则
      addFormRules: {
        //添加用户名的规则
        role_name: [{ required: true, validator: validateUsername }],
        email: [{ required: true, validator: validateEmail }],
        mobile: [{ required: true, validator: validatePhone }],
      },
      //  修改对话框的显示和隐藏
      editDialogVsible: false,
      //  编辑对应用户的下标
      userId: '',
      // 修改表单的数据
      editForm: {},
      // 修改表单的验证规则
      editFormRules: {
        role_name: [{ required: true, validator: validateUsername }],
        email: [{ required: true, validator: validateEmail }],
        mobile: [{ required: true, validator: validatePhone }],
      },
      // 判断当前状态是否为查询
      inquiry: false,
      //  分配用户窗口
      giveDialogVsible: false,
      // 修改表单的数据
      giveForm: {},
      // 修改表单的验证规则
      // giveFormRules: {
      //   username: [{ required: true, validator: validateUsername }],
      // },
    }
  },
  created() {
    this.setAdminData()
    this.getAdminData()
    this.handleSizeChange(3)
  },

  methods: {
    // 存入 数据到浏览器
    setAdminData() {
      //clear()
      //只有页面第一次执行的时候才触发
      if (get('Admin') == null)
        set('Admin', {
          user: [
            {
              role_name: '测试角色1',
              username: 'admin',
              mobile: '15868495501',
              state: true,
              email: '123456@qq.com',
              id: 1,
            },
            {
              role_name: '测试角色2',
              username: 'admin2',
              mobile: '15878486501',
              state: true,
              email: '1234567@qq.com',
              id: 2,
            },
            {
              role_name: '管理员1',
              username: 'ahsc',
              mobile: '17886899888',
              state: true,
              email: '12345678@qq.com',
              id: 3,
            },
            {
              role_name: '管理员2',
              username: 'azs',
              mobile: '16817896689',
              state: false,
              email: '123456789@qq.com',
              id: 4,
            },
            {
              role_name: '管理员3',
              username: 'zsls',
              mobile: '18817896689',
              state: false,
              email: '1234567899@qq.com',
              id: 5,
            },
          ],
        })
    },
    // 获取 存入的数据
    getAdminData() {
      var adminDatas = get('Admin')
      //  遍历数组添加 id
      adminDatas.user.forEach((item, n = 0) => {
        item.id = ++n
      })
      this.users = adminDatas.user
      // 数据的数量
      this.totals = adminDatas.user.length
    },
    //监听pagesize (展示数据的数量)改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      //this.getAdminData();
      //处理数组，根据pagesize参数来对数组对象重新分组=>[[],[]]
      var result = []
      for (var i = 0; i < this.totals; i += newSize) {
        result.push(this.users.slice(i, i + newSize))
      }
      this.changeusers = result
      //console.log(this.changeusers)
      //this.totals = this.users.length
      //  查询时展示数量的处理
      this.shownews = this.changeusers[this.queryInfo.pagenum - 1]
      // 当输入框内容不为空
      if (this.inquiry == true) this.getUserList()
    },
    //监听 页码 值改变
    handleCurrentChange(newPage) {
      //console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.shownews = this.changeusers[newPage - 1]
      // 根据是否有查询内容进行触发来覆盖没有查询的跳转
      if (this.inquiry == true) this.getUserList()
    },
    //监听state状态改变
    stateChange(userinfo) {
      //查询数组中对象的id是否存在，并返回下标值
      var i = this.users.map((item) => item.id).indexOf(userinfo.id)
      // 根据数组下标值替换数组的成员
      this.users.splice(i, 1, userinfo)
      //console.log(this.users)
      //修改后保存到浏览器中
      set('Admin', {
        user: this.users,
      })
      this.$message.success('更新用户状态成功')
    },
    //模糊搜索
    getUserList() {
      if (this.queryInfo.query != '') {
        // 对usernam键进行模糊匹配
        var j = this.users.filter((n) => {
          //  n匹配的数组
          return n.username.includes(this.queryInfo.query)
        })
        // 更新查询后的数组长度 => 数据的数量
        this.totals = j.length

        var result = []
        for (var i = 0; i < j.length; i += this.queryInfo.pagesize) {
          result.push(j.slice(i, i + this.queryInfo.pagesize))
        }
        //console.log(result[this.queryInfo.pagenum-1])
        this.queryInfo.queryData = result
        this.shownews = result[this.queryInfo.pagenum - 1]
        this.inquiry = true
      } else {
        this.totals = this.users.length
        this.inquiry = false
      }
    },
    //  重置添加对话框的表单
    addDialogClose() {
      //  对应的表单 addFormRef    清空表单resetFields()
      this.$refs.addFormRef.resetFields()
    },
    // 添加管理员
    addUser() {
      //接收校验结果
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return

        // 添加状态值 和 id
        var n = this.totals
        this.addForm.state = 'true'
        this.addForm.id = n + 1
        this.users.push(this.addForm)

        set('Admin', {
          user: this.users,
        })

        // 根据数组长度判定是否成功
        //var data = get('Admin')
        //if (data.user.length > this.totals)
        this.$message.success('添加成功')
        //this.$message.success('添加失败')

        this.addDialogVisible = false
        // 重新获取数据
        this.getAdminData()
        this.handleSizeChange(this.queryInfo.pagesize)
      })
    },
    // 修改按钮对话框
    showEditDialog(id) {
      // 获取最新数据，避免修改的是缓存的
      //var admin = get('Admin')
      //this.userId = admin.user.map((item) => item.id).indexOf(id)
      // 通过id查询到下标
      this.userId = this.users.map((item) => item.id).indexOf(id)
      // 如果存在返回其下标值
      if (this.userId != -1) {
        this.editDialogVsible = true
      }
      this.editForm = this.users[this.userId]
      //console.log(this.editForm)
    },
    // 监听修改对话框，关闭时重置
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 提交修改的表单
    editUserInfo() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return

        // 根据下标值进行修改对应的数组对象
        this.users.splice(this.userId, 1, this.editForm)
        //console.log(this.users)
        set('Admin', {
          user: this.users,
        })

        this.$message.success('修改成功')

        /****   获取最新数据
         * var Admin = get('Admin')
         * // 查询最新数据中是否存在改对象
         * if (Admin.user.indexOf(this.editForm) != -1) {
         *   this.userId = Admin.user.indexOf(this.editForm)
         *   this.users = Admin.user.splice(this.userId, 1, this.editForm)
         *   set('Admin', { user: this.users })
         * //获取最新的数据进行查询，存在就表示成功
         *   var Admin2 = get('Admin')
         *   if (Admin2.user.indexOf(this.editForm) == this.userId)
         *     this.$message.success('修改成功')
         *   this.$message.success('添加失败')
         * }
         */

        this.editDialogVsible = false
        this.getAdminData()
        this.handleSizeChange(this.queryInfo.pagesize)
      })
    },
    // 根据手机号删除用户的信息
    removeUserById(mobile) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 获取最新数据，避免删除的是缓存的
          var admin = get('Admin')
          // 通过用户名查询到下标进行筛选删除
          this.users = admin.user.filter((item) => item.mobile != mobile)
          set('Admin', { user: this.users })
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          this.getAdminData()
          this.handleSizeChange(this.queryInfo.pagesize)
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
    giveUserById(id) {
      this.userId = this.users.map((item) => item.id).indexOf(id)
      // 如果存在返回其下标值
      if (this.userId != -1) this.givetForm = this.users[this.userId]
      this.giveDialogVsible = true
    },
    // 监听分配对话框，关闭时重置
    giveDialogClose() {
      this.$refs.giveFormRef.resetFields()
    },
    giveUserInfo() {
      // 获取账号进行判断是否存在
      var account = get('Account').adminUser
      var n = account
        .map((item) => item.username)
        .indexOf(this.giveForm.username)
      //console.log(account, this.giveForm.username, n)
      if (n == -1) return this.$message.warning('用户账号不存在')

      // 获取分配列表判断是否被占用
      var admin = get('Admin').user
      var m = admin.map((item) => item.username).indexOf(this.giveForm.username)
      if (m != -1) return this.$message.warning('用户账号已经被占用')

      // 给对应数据添加修改内容

      // 没有属性时通过 . 的方式添加, 存在就替换
      admin[this.userId].username = this.giveForm.username

      // 根据下标值进行修改对应的数组对象
      this.users.splice(this.userId, 1, admin[this.userId])
      console.log(admin[this.userId])
      set('Admin', {
        user: this.users,
      })
      this.$message.success('修改成功')
      this.givetDialogVsible = false
      this.getAdminData()
      this.handleSizeChange(this.queryInfo.pagesize)
    },
    // 用户账号管理跳转
    gotolink() {
      this.$router.push({ name: 'AdminAccount' })
    },
    test() {
      clear()
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
