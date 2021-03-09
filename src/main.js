import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/**element框架 */
//import './plugins/element'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

//第三方字体
import 'font-awesome/css/font-awesome.min.css'

//全局样式表
import './assets/css/global.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
