import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入element-ui S
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(Element)
new Vue({
    router,
    store,
    render: function(h) { return h(App) }
}).$mount('#app')