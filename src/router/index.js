import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../components/Home/Main'
import Login from '../components/Home/Login'
//载入css
import '../assets/css/global.css'
import store from '../store/index'
import UserList from '../components/User/userList'
import HomeIndex from '../components/Home/Index'
import RoleList from '../components/User/RoleList'
import FictionType from '../components/Fiction/FictionType'
import FictionList from '../components/Fiction/FictionList'
Vue.use(VueRouter)

const router = new VueRouter({
        //路由
        routes: [
            { path: "/", redirect: '/login' },
            { path: '/login', component: Login, meta: { title: '登录' } },
            {
                path: '/Main',
                component: Main,
                meta: { title: '后台管理首页' },
                //子路由
                children: [
                    { path: '/Main/Index', component: HomeIndex, meta: { title: "个人中心" } },
                    { path: '/user/userList', component: UserList, meta: { title: "用户列表" } },
                    { path: '/role/roleList', component: RoleList, meta: { title: "角色列表" } },
                    { path: '/Fiction/FictionType', component: FictionType, meta: { title: "小说分类" } },
                    { path: '/Fiction/FictionList', component: FictionList, meta: { title: "小说分类" } },
                ]
            }

        ]
    })
    //Avoided redundant navigation to current location
    //避免了到当前位置的冗余导航
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
        return originalPush.call(this, location).catch(err => err)
    }
    //挂载路由导航守卫
    //to 将要访问的路径
    //from 代表从哪个路由来
    //next 是一个函数 表示放行
router.beforeEach((to, from, next) => {
    //默认登录页
    if (to.path === "/login") {
        return next();
    }
    //获取token   
    var token = store.getters.userToken;

    if (!token) {
        return next("/login");
    }
    //动态设置标题
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    return next();
})

export default router