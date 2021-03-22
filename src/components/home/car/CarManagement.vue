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
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
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
        <el-table-column label="图片" prop></el-table-column>
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
              @click="removeUserById(scope.row.id)"
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
  </div>
</template>

<script>
import { get, set } from '@/assets/js/localStorage.js'
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
        totals: '',
      },
      //  查询
      queryInfo: {
        query: '',
        queryData: '',
      },
      // 查询状态
      inquiry: true,
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
              brand: '桂A·8586L',
              carType: 'c1',
              carName: '轩逸',
              carColor: '白色',
              coach: 'daa2',
              id: 1,
            },
            {
              brand: '桂A·5686L',
              carType: 'c1',
              carName: '雪铁龙C3L',
              carColor: '白色',
              coach: 'dab2',
              id: 2,
            },
            {
              brand: '桂A·50867',
              carType: 'c1',
              carName: '雪铁龙C3L',
              carColor: '白色',
              coach: 'dac2',
              id: 3,
            },
          ],
        })
    },
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
    goAddPage() {
      this.$router.push('/carManagement/addCar')
    },
    handleSizeChange(newSize) {
      this.pagingInfo.pagesize = newSize
      //this.getAdminData();
      //处理数组，根据pagesize参数来对数组对象重新分组=>[[],[]]
      var result = []
      for (var i = 0; i < this.pagingInfo.totals; i += newSize) {
        result.push(this.cars.slice(i, i + newSize))
      }
      this.changeCars = result
      // console.log(this.changeCars)
      //  查询时展示数量的处理
      this.shownews = this.changeCars[this.pagingInfo.pagenum - 1]
      // 当输入框内容不为空
      if (this.inquiry == true) this.getUserList()
    },
    handleCurrentChange() {
      this.pagingInfo.pagenum = newPage
      this.shownews = this.changeCars[newPage - 1]
      // 根据是否有查询内容进行触发来覆盖没有查询的跳转
      if (this.inquiry == true) this.getUserList()
    },
    getUserList() {
      if (this.queryInfo.query != '') {
        // 对usernam键进行模糊匹配
        var j = this.cars.filter((n) => {
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
    showEditDialog(id) {},
    removeUserById(id) {},
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