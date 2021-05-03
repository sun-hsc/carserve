<template>
  <div id="home">
    <el-container class="home-container">
      <!--头部区域-->
      <el-header>
        <div>
          <img src="../assets/img/logo_car.png" alt class="img_logo" />
          <span>驾校预约管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <!--主体区域-->
      <el-container>
        <!--左侧菜单区域-->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#00a1d6"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            router
            :default-active="$route.path"
          >
            <!--active-text-color活跃状态的字体颜色
            unique-opened默认为true，只展开一项-->
            <!--collapse菜单展示的状态-->
            <!--:collapse="isCollapse"  绑定菜单折叠功能-->
            <!--:router="ture"开启 绑定id到对应路由功能-->
            <!--:default-active="$route.path" 通过$route.path获取活跃的路由绑定高亮-->
            <!--一级菜单-->
            <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
              <!--index只接收字符串-->
              <template slot="title">
                <!--图标-->
                <i :class="iconsObj[item.id]" aria-hidden="true"></i>
                <!--文本-->
                <span>{{ item.authName }}</span>
              </template>
              <!--二级菜单-->
              <el-menu-item
                :index="'/' + subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>

        <!--右侧主体区域-->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { set, get, remove } from '@/assets/js/localStorage'
export default {
  name: 'Home',
  data() {
    return {
      //左侧菜单
      menulist: [],
      iconsObj: {
        1: 'fa fa-user fa-lg fa-fw',
        2: 'fa fa-file-text fa-lg fa-fw',
        3: 'fa fa-car fa-lg fa-fw',
        4: 'fa fa-history fa-lg fa-fw',
        5: 'fa fa-bullhorn fa-lg fa-fw',
      },
      //折叠菜单
      isCollapse: false,
    }
  },
  created() {
    this.setList()
    this.getMenuList()
  },
  methods: {
    logout() {
      // 清空当前登录状态   清空token值
      window.sessionStorage.clear()
      //清空后跳转 login
      this.$router.push('/login')
    },
    // 数据存到local storage
    setList() {
      set('MenuList', {
        datas: [
          {
            id: 1,
            authName: '用户管理',
            children: [
              { id: 11, authName: '管理员列表', path: 'admin' },
              { id: 12, authName: '教员列表', path: 'coachs' },
              { id: 13, authName: '学员列表', path: 'students' },
            ],
          },
          {
            id: 2,
            authName: '预约记录',
            children: [
              { id: 21, authName: '学员预约记录', path: 'studentRecord' },
            ],
          },
          {
            id: 3,
            authName: '车辆管理',
            children: [{ id: 31, authName: '车辆信息', path: 'carManagement' }],
          },
          {
            id: 4,
            authName: '预约管理',
            children: [
              { id: 41, authName: '学员预约', path: 'studentOrder' },
              { id: 42, authName: '教练预约', path: 'coachOrder' },
            ],
          },
          {
            id: 5,
            authName: '公告管理',
            children: [{ id: 51, authName: '公告信息', path: 'notice' }],
          },
        ],
      })
    },
    //获取所有的菜单
    getMenuList() {
      /**   权限
       var Authorization = "tttt"
      if(  Authorization != window.sessionStorage.getItem("token"))
      return console.log("请重新登录");
      */

      let menulists = get('MenuList')
      this.menulist = menulists.datas
      //console.log(menulists.datas)
    },
    //切换菜单的状态
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
  },
  computed: {},
  components: {},
}
</script>

<style lang="less" scoped>
#home {
  height: 100%;
}
.home-container {
  height: 100%;
}

.el-header {
  background-color: #4e595f;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding-left: 1%;
  color: #fff;
  font-size: 23px;
  > div {
    display: flex;
    align-items: center;
    img {
      widows: 80px;
      height: 40px;
    }
    span {
      margin-left: 20px;
    }
  }
}

.el-aside {
  background-color: #4e595f;

  .el-menu {
    /**去掉右边框线，让列表对齐 */
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  /**区域光标变成小手的形状 */
  cursor: pointer;
}
</style>
