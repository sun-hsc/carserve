<template>
  <div class="admin-account">
    <!--面包屑导航区-->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
      <el-breadcrumb-item>管理员账号列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--视图卡片区-->
    <el-card>
      <el-row :gutter="20">
        <!--搜索区-->
        <el-col :span="8">
          <el-input
            placeholder="请输入用户账号"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="queryData"
          >
            <el-button slot="append" icon="el-icon-search" @click="queryData"></el-button>
          </el-input>
        </el-col>
        <!--添加账号-->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户账号</el-button>
        </el-col>
      </el-row>

      <!--用户列表区-->
      <el-table :data="showDatas" border stripe>
        <el-table-column label="#" prop="id" width="40px"></el-table-column>
        <el-table-column label="用户账号" prop="username"></el-table-column>
        <el-table-column label="密码" prop="password"></el-table-column>
        <!--编辑区-->
        <el-table-column label="操作">
          <!--v-slot="scope"  作用域插槽绑定用于绑定对应的数据-->
          <template v-slot="scope">
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
              @click="removeUserById(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区-->
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dataTotals"
      >
        <!--:current-page当前页  :page-size当前的展示数据  :page-sizes选着展示的页面数据-->
      </el-pagination>
    </el-card>

    <!--添加窗口-->
    <el-dialog title="提示" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <!--表单编辑区-->
      <el-form ref="addFormRef" :model="addAdminForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="addAdminForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addAdminForm.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { set, get } from '@/assets/js/localStorage'
import { validateUsername, validatePassword } from '@/assets/js/validate'
import { isHasObj } from '@/assets/js/lpl2'
export default {
  name: 'AdminAccount',
  data() {
    return {
      datas: [],
      // 数组长度
      dataTotals: '',
      // 从新分组
      changeDatas: '',
      // 展示的数据
      showDatas: [],
      // 判断当前状态是否为查询
      inquiry: false,
      // 分页跟查询的内容
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
      // 添加对话框激活
      addDialogVisible: false,
      // 添加对话框表单
      addAdminForm: {
        username: '',
        password: '',
      },
      // addForm
      addFormRules: {
        username: [{ required: true, validator: validateUsername }],
        password: [{ required: true, validator: validatePassword }],
      },
    }
  },
  created() {
    this.getAccount()
    this.handleSizeChange(3)
  },
  methods: {
    getAccount() {
      var i = get('Account')
      this.datas = i.adminUser
      this.dataTotals = this.datas.length
      //console.log(this.datas)
    },
    // 监听页码改变
    handleSizeChange(newSize) {
      // 给数据加上id
      this.datas.forEach((item, n = 0) => {
        item.id = ++n
      })
      // 根据展示数据变量裁切分组
      this.queryInfo.pagesize = newSize
      var result = []
      for (var i = 0; i < this.dataTotals; i += newSize) {
        result.push(this.datas.slice(i, i + newSize))
      }
      // 裁切好的数据数组
      this.changeDatas = result
      // 数据长度 => 数据量
      this.dataTotals = this.datas.length
      //  查询时展示数量的处理
      this.showDatas = this.changeDatas[this.queryInfo.pagenum - 1]
      // 根据监听到inquiry的状态来判断展示查询的内容
      if (this.inquiry == true) this.queryData()
    },
    //监听 页码 值改变
    handleCurrentChange(newPage) {
      //console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.showdatas = this.changeDatas[newPage - 1]
      // 根据是否有查询内容进行触发来覆盖没有查询的跳转
      if (this.inquiry == true) this.queryData()
    },
    //模糊搜索
    queryData() {
      if (this.queryInfo.query != '') {
        // 对usernam键进行模糊匹配
        var j = this.datas.filter((n) => {
          //  n匹配的数组
          return n.username.includes(this.queryInfo.query)
        })
        // 更新查询后的数组长度 => 数据的数量
        this.dataTotals = j.length
        // 查询后重新分组
        var result = []
        for (var i = 0; i < j.length; i += this.queryInfo.pagesize) {
          result.push(j.slice(i, i + this.queryInfo.pagesize))
        }
        //console.log(result[this.queryInfo.pagenum-1])
        this.queryInfo.queryData = result
        this.showDatas = result[this.queryInfo.pagenum - 1]
        this.inquiry = true
      } else {
        // 清除状态后恢复数组长度
        this.dataTotals = this.datas.length
        this.inquiry = false
      }
    },
    // 关闭添加对话框时清空添加列表的状态
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      //接收校验结果
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return
        // 获取新的数据
        var uesrs = get('Account')
        console.log(this.addAdminForm)
        console.log(uesrs.adminUser)
        // 进行查询判断是否存在
        var n = uesrs.adminUser
          .map((item) => item.b)
          .indexOf(this.addAdminForm.username)

        if (n == -1) this.$message.success('添加失败,用户已经存在')
        uesrs.adminUser.push(this.addAdminForm)
        console.log(uesrs.adminUser)
        // 更新数据
        set('Account', { addUser: uesrs.adminUser })
        this.$message.success('添加成功')
        // 重新获取数据
        this.handleCurrentChange(this.queryInfo.pagesize)
        // 关闭窗口
        this.addDialogVisible = false
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
</style>
