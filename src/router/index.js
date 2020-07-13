import Vue from 'vue'
import VueRouter from 'vue-router'
//import Home from '../views/Home.vue'
import Login from '../components/Home/Login'
//载入css
import '../assets/css/global.css'

Vue.use(VueRouter)

const router = new VueRouter({
    //路由
    routes: [
        { path: "/", redirect: '/login' },
        { path: '/login', component: Login, meta: { title: '登录' } },
        // {
        //     path: '/Home',
        //     component: Home,
        //     meta: { title: '后台管理首页' },
        // }

    ]
})

export default router