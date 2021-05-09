<template>
  <div class="car-management">
    <!--面包屑导航区-->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>车辆管理</el-breadcrumb-item>
      <el-breadcrumb-item>车辆信息列表</el-breadcrumb-item>
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
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getCarList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getCarList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加车辆信息</el-button>
        </el-col>
      </el-row>

      <!--车辆列表区-->
      <el-table :data="shownews" border stripe>
        <!--border边框 stripe隔行变色  -->
        <el-table-column label="#" prop="id" width="40px"></el-table-column>
        <el-table-column label="车牌号" prop="brand"></el-table-column>
        <el-table-column label="车辆名称" prop="carName"></el-table-column>
        <el-table-column label="车辆类型" prop="carType"></el-table-column>
        <el-table-column label="车辆颜色" prop="carColor"></el-table-column>
        <el-table-column label="教员" prop="coach"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!--v-slot="scope"  作用域插槽绑定用于绑定对应的数据-->
            <!--修改按钮-->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.brand)"
            ></el-button>
            <!--删除按钮-->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="removeCarByBrand(scope.row.brand)"
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

    <!--编辑信息对话框-->
    <el-dialog
      title="修改车辆信息"
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
        <el-form-item label="车牌号" prop="brand">
          <el-input v-model="editForm.brand" disabled></el-input>
        </el-form-item>
        <el-form-item label="车辆名称" prop="carName">
          <el-input v-model="editForm.carName"></el-input>
        </el-form-item>
        <el-form-item label="车辆类型">
          <el-radio-group v-model="radio" @change="getCarType">
            <el-radio :label="1">C1</el-radio>
            <el-radio :label="2">C2</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="车辆颜色">
          <el-select v-model="color">
            <el-option
              v-for="item in colorOptions"
              :key="item.id"
              :label="item.color"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教员名字">
          <el-input v-model="editForm.coach"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVsible = false">取 消</el-button>
        <el-button type="primary" @click="editCarInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { get, set } from '@/assets/js/localStorage.js'
import { validateCarNum, validateCarName } from '@/assets/js/validate.js'
export default {
  name: 'CarManagement',
  data() {
    return {
      // 所有数据
      cars: '',
      // 渲染到页面的数据
      shownews: '',
      //展示页面所有数据的重组[[],[]]
      changeCars: '',
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
      // 查询状态
      inquiry: true,
      // 修改表单
      editForm: {
        brand: '',
        carType: '',
        carName: '',
        carColor: '',
        coach: ''
      },
      // 修改数据的对应下标
      carIndex: '',
      editFormRules: {
        carName: [{ required: true, validator: validateCarName }],
        brand: [{ required: true, validator: validateCarNum }]
      },
      editDialogVsible: false,
      // 单选框
      radio: 1,
      // 颜色下拉列表
      colorOptions: [
        {
          id: '白色',
          color: '白色'
        },
        {
          id: '灰色',
          color: '灰色'
        },
        {
          id: '黄色',
          color: '黄色'
        }
      ],
      color: ''
    }
  },
  created() {
    this.setCar()
    this.getCars()
    this.handleSizeChange(this.pagingInfo.pagesize)
  },
  methods: {
    setCar() {
      if (get('Cars') == null)
        set('Cars', {
          car: [
            {
              brand: '桂A8586L',
              carType: 'C1',
              carName: '轩逸',
              carColor: '白色',
              coach: '王一',
              id: 1
            },
            {
              brand: '桂A5686L',
              carType: 'C1',
              carName: '雪铁龙C3L',
              carColor: '白色',
              coach: '王二',
              id: 2
            },
            {
              brand: '桂A50867',
              carType: 'C1',
              carName: '雪铁龙C3L',
              carColor: '白色',
              coach: '王三',
              id: 3
            },
            {
              brand: '桂K95519',
              carType: 'C1',
              carName: '雅阁',
              carColor: '白色',
              coach: '王四',
              id: 4
            },
            {
              brand: '桂K95619',
              carType: 'C1',
              carName: '雅阁',
              carColor: '白色',
              coach: '王五',
              id: 5
            },
            {
              brand: '桂A50897',
              carType: 'C2',
              carName: '雪铁龙C3L',
              carColor: '白色',
              coach: '王玲',
              id: 6
            }
          ]
        })
    },
    // 获取数据
    getCars() {
      var cardata = get('Cars')
      //  遍历数组添加 id
      cardata.car.forEach((item, n = 0) => {
        item.id = ++n
      })
      this.cars = cardata.car
      // 数据的数量
      this.pagingInfo.totals = cardata.car.length
    },
    // 跳转添加页面
    goAddPage() {
      this.$router.push('/carManagement/addCar')
    },
    // 监听展示数据改变
    handleSizeChange(newSize) {
      this.pagingInfo.pagesize = newSize
      //处理数组，根据pagesize参数来对数组对象重新分组=>[[],[]]
      var result = []
      for (var i = 0; i < this.pagingInfo.totals; i += newSize) {
        result.push(this.cars.slice(i, i + newSize))
      }
      this.changeCars = result
      //  查询时展示数量的处理
      this.shownews = this.changeCars[this.pagingInfo.pagenum - 1]
      // 当输入框内容不为空
      if (this.inquiry == true) this.getCarList()
    },
    // 监听页面改变
    handleCurrentChange(newPage) {
      this.pagingInfo.pagenum = newPage
      this.shownews = this.changeCars[newPage - 1]
      // 根据是否有查询内容进行触发来覆盖没有查询的跳转
      if (this.inquiry == true) this.getCarList()
    },
    // 监听查询内容进行查询
    getCarList() {
      if (this.queryInfo.query != '') {
        // 对usernam键进行模糊匹配
        var j = this.cars.filter(n => {
          //  n匹配的数组
          return n.brand.includes(this.queryInfo.query)
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
        var result = []
        var j = this.pagingInfo.pagesize
        for (var i = 0; i < this.pagingInfo.totals; i += j) {
          result.push(this.cars.slice(i, i + j))
        }
        this.changeCars = result
        this.shownews = this.changeCars[this.pagingInfo.pagenum - 1]
        this.pagingInfo.totals = this.cars.length
        this.inquiry = false
      }
    },
    // 删除展示的内容
    removeCarByBrand(brand) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 获取最新数据，避免删除的是缓存的
          var carData = get('Cars')
          // 通过用户名查询到下标进行筛选删除
          this.cars = carData.car.filter(item => item.brand != brand)
          set('Cars', { car: this.cars })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getCars()
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
    // 根据车牌号码来修改相应的数据
    showEditDialog(brand) {
      // 获取最新数据，避免修改的是缓存的
      this.cars = get('Cars').car
      // 通过用户账号查询到下标
      this.carIndex = this.cars.map(item => item.brand).indexOf(brand)
      // 如果存在返回其下标值
      if (this.carIndex == -1) {
        this.$message.success('该车辆不存在，刷新页面获取最新信息')
      } else {
        this.editDialogVsible = true
        this.editForm = this.cars[this.carIndex]
        // 赋值给对应的参数，让修改对话框显示修改的对应数据
        this.color = this.cars[this.carIndex].carColor
        if (this.cars[this.carIndex].carType == 'C1') {
          this.editForm.carType = this.cars[this.carIndex].carType
          this.radio = 1
        } else {
          this.editForm.carType = this.cars[this.carIndex].carType
          this.radio = 2
        }
        //console.log(this.cars[this.carIndex].carType)
      }
    },
    // 监听修改对话框，关闭时重置
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 根据选项绑定类型的值 C1 C2
    getCarType() {
      if (this.radio == 1) return (this.editForm.carType = 'C1')
      return (this.editForm.carType = 'C2')
    },
    // 下拉列表选着颜色改变
    getCarColor() {
      this.editForm.carColor = this.color
    },
    // 修改数据提交按钮
    editCarInfo() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return

        // 根据下标值进行修改对应的数组对象，插入数据
        this.cars.splice(this.carIndex, 1, this.editForm)
        console.log(this.cars)
        set('Cars', { car: this.cars })
        // 获取最新数据进行查询判断是否修改成功
        var datas = get('Cars').car
        var n = datas.map(item => item.brand).indexOf(this.editForm.brand)
        if (n == -1) this.$message.info('修改失败')
        this.$message.success('修改成功')

        this.editDialogVsible = false
        this.getCars()
        this.handleSizeChange(this.pagingInfo.pagesize)
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
