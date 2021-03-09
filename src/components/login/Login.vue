<template>
  <div class="login">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../../assets/img/login_img/login.png" alt />
      </div>
      <!--表单区-->
      <!--绑定数据:mode 绑定规则:rules  获取当前对象ref -->
      <el-form
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <!--pop 绑定验证规则 loginFormRules中的对象-->
        <!--用户名-->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" type="password" v-model="loginForm.password"></el-input>
        </el-form-item>
        <!--按钮区-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { set, get } from '@/assets/js/localStorage'
import { isHasObj } from '@/assets/js/lpl2.js'
import { validateUsername, validatePassword } from '@/assets/js/validate'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      // 表单验证规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          {
            min: 6,
            max: 18,
            message: '长度在 6 到 18 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    this.setLogin()
  },
  methods: {
    // 表单重置按钮
    resetLoginForm() {
      // console.log(this) 测试能否获取对象
      // resetFields：element-ui提供的表单方法 ——> 表单重置
      this.$refs.loginFormRef.resetFields()
    },
    setLogin() {
      set('Account', {
        adminUser: [
          { username: 'admin', password: '123456' },
          { username: 'admin2', password: '123456' },
        ],
      })
    },
    login() {
      /**validate（）时elment-ui封装好的用于对整个表单进行验证
         validate的参数是一个回调函数。该回调函数在校验结束后被调用，
         是否校验成功和未通过校验的字段。 */
      /**validate回调函数 验证表单的输入内容是否符合规范 通过返回的布尔值判断*/
      this.$refs.loginFormRef.validate((valid) => {
        if (!valid) return false

        const res = get('Account')
        console.log(res)

        /**根据返回的状态码判断是否登录成功 */

        /**$message element的弹窗组件 */
        if (isHasObj(res.adminUser, this.loginForm) !== true)
          return this.$message.error('登录失败!')
        this.$message.success('登录成功')
        // 1.将登录成功之后的token, 保存到客户端的sessionStorage 中
        //1.1项目中出了登录之外的其他API接口，必须在登录之后才能访问
        //1.2 token只应在当前网站打开期间生效，所以将token保存在sessionStorage 中
        window.sessionStorage.setItem('token', 'tttt')
        // 2.通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push('/home')
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login {
  background-color: #2b4b6b;
  height: 100%;
  width: 100%;

  /*位置 login_box 
  display: flex;
  justify-content: center;
  align-items: center;
  */
}

.login_box {
  /**大小 */
  width: 500px;
  height: 350px;
  background-color: #fff;

  border-radius: 5%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60%;
  padding: 0 10%;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
