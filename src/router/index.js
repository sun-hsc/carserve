import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('@/components/login/Login.vue')
const Home = () => import('@/components/home/Home.vue')
const Welcome = () => import('@/components/Welcome.vue')

//用户管理
const Admin = () => import('@/components/home/user/Admin.vue')
const AdminAccount = () => import('@/components/home/user/AdminAccount.vue')
const Students = () => import('@/components/home/user/Students.vue')
const Coachs = () => import('@/components/home/user/Coachs.vue')
//import Login from '../components/login/Login.vue'

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
      { path: '/Admin', component: Admin },
      {
        path: '/admin/adminAccount',
        name: 'AdminAccount',
        component: AdminAccount
      },
      { path: '/Students', component: Students },
      { path: '/Coachs', component: Coachs }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
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
