<template>
  <div class="add-car">
    <!--面包屑导航区-->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>车辆管理</el-breadcrumb-item>
      <el-breadcrumb-item>车辆信息列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加车辆信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!--视图卡片区-->
    <el-card>
      <!--提示区域-->
      <el-alert title="提示车辆信息" type="info" center show-icon></el-alert>
      <!--进度条-->
      <!--activeIndex - 0 隐式转换 -->
      <el-steps :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="车辆基本信息"></el-step>
        <el-step title="车辆其它信息"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!--用form表单嵌套tabs是分页的数据合成一条完成的数据-->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="right"
      >
        <!--label-position设置表单的区域位置-->
        <!--tabs标签区域-->
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
        >
          <el-tab-pane label="车辆基本信息" name="0">
            <el-form-item label="车辆名字" prop="carName">
              <el-input
                v-model="addForm.carName"
                style="width:220px"
              ></el-input>
            </el-form-item>
            <el-form-item label="车辆类型">
              <el-radio-group v-model="radio" @change="getCarType">
                <el-radio :label="1">C1</el-radio>
                <el-radio :label="2">C2</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="车辆颜色">
              <el-select v-model="color" @change="getCarColor">
                <el-option
                  v-for="item in colorOptions"
                  :key="item.id"
                  :label="item.color"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="车辆其它信息" name="1">
            <el-form-item label="车牌号码" prop="brand">
              <el-input v-model="addForm.brand"></el-input>
            </el-form-item>
            <el-form-item label="教员名字">
              <el-input v-model="addForm.coach"></el-input>
            </el-form-item>
            <el-button type="primary" round @click="addCar"
              >添加车辆信息</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { validateCarNum, validateCarName } from '@/assets/js/validate.js'
import { get, set } from '@/assets/js/localStorage.js'
export default {
  name: 'AddCar',
  data() {
    return {
      //激活步骤条绑定
      activeIndex: '0',
      addForm: {
        brand: '',
        carType: 'C1',
        carName: '',
        carColor: '白色',
        coach: ''
      },
      addFormRules: {
        carName: [{ required: true, validator: validateCarName }],
        brand: [{ required: true, validator: validateCarNum }]
      },
      // 绑定单选框内容
      radio: 1,
      // 绑定下拉列表
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
      color: '白色'
    }
  },
  created() {},
  methods: {
    // 根据选项绑定类型的值 C1 C2
    getCarType() {
      if (this.radio == 1) return (this.addForm.carType = 'C1')
      return (this.addForm.carType = 'C2')
    },
    // 下拉列表选着颜色改变
    getCarColor() {
      this.addForm.carColor = this.color
    },
    // 根据验证的结果阻止标签页的切换
    beforeTabLeave(activeName, oldActiveName) {
      var i = parseInt(this.activeIndex)
      //console.log(i + 1)
      switch (i + 1) {
        case 1:
          if (this.addForm.carName == '') {
            this.$message.error('请输入车辆名字')
            return false
          }
          break
        case 2:
          if (this.addForm.brand == '') {
            this.$message.error('请输入车牌号码')
            return false
          }
          break
        default:
      }
    },
    // 添加车辆信息
    addCar() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return this.$refs.error('请填写完整的信息！')
        // 执行添加的的功能
        var datas = get('Cars').car
        this.addForm.id = datas.length + 1
        datas.push(this.addForm)
        //console.log(datas)
        set('Cars', { car: datas })

        this.$message.success('信息添加成功')
        this.$router.push('/carManagement')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
</style>
