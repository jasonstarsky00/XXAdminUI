import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入element-ui S
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 配置msg
import { Message } from 'element-ui'
import { Confirm } from 'element-ui'
//配置axios
import qs from 'qs'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:1111/api/'
    //axios.defaults.baseURL = 'http://localhost:64187/api/'
    //配置axios拦截器添加token
axios.interceptors.request.use(config => {

    config.headers.Authorization = store.getters.userToken;
    //console.log("token：" + config.headers.Authorization)
    //最后必须返回config
    return config
})

//配置vuex
//import store from './store/index'


Vue.prototype.$http = axios
Vue.prototype.$msg = Message
Vue.prototype.$confirm = Confirm
Vue.prototype.$qs = qs
    //Vue.prototype.$qs = qs

Vue.config.productionTip = false
Vue.use(Element)
new Vue({
    router,
    store,
    render: function(h) { return h(App) }
}).$mount('#app')