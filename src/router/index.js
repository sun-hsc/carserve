import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('@/components/login/Login.vue')
const Home = () => import('@/components/Home.vue')
const Welcome = () => import('@/components/Welcome.vue')

//用户管理
const Admin = () => import('@/components/home/user/Admin.vue')
const AdminAccount = () => import('@/components/home/user/AdminAccount.vue')
const Students = () => import('@/components/home/user/Students.vue')
const Coachs = () => import('@/components/home/user/Coachs.vue')

//预约记录
const StudentRecord = () => import('@/components/home/record/StudentRecord.vue')
//车辆管理
const CarManagement = () => import('@/components/home/car/CarManagement.vue')
const AddCar = () => import('@/components/home/car/AddCar.vue')
// 预约管理
const StudentOrder = () => import('@/components/home/order/StudentOrder.vue')
const CoachOrder = () => import('@/components/home/order/CoachOrder.vue')
//公告管理
const Notice = () => import('@/components/home/notice/Notice.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    //redirect  页面子路由  children配置子路由的信息
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      //用户管理
      { path: '/admin', component: Admin },
      {
        path: '/admin/adminAccount',
        name: 'AdminAccount',
        component: AdminAccount
      },
      { path: '/students', component: Students },
      { path: '/coachs', component: Coachs },
      //预约记录
      { path: '/studentRecord', component: StudentRecord },
      //车辆管理
      { path: '/carManagement', component: CarManagement },
      { path: '/carManagement/addCar', component: AddCar },
      // 预约管理
      { path: '/studentOrder', component: StudentOrder },
      { path: '/coachOrder', component: CoachOrder },
      //公告管理
      { path: '/notice', component: Notice }
    ]
  }
]

const router = new VueRouter({
  //mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 挂载路由导航守卫
/**router.beforeEach  要放在router = new VueRouter下面 */
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //next() 放行   next('/login')强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
