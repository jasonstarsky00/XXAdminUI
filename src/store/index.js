import Vue from 'vue'
import vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
var ls = new SecureLS({ isCompression: false });
/*
使用vuex 缓存数据，
使用vuex-persistedstate，持久化缓存数据，不会因为刷新丢失
使用secure-ls 加密存储缓存到storage中
*/
Vue.use(vuex);
const store = new vuex.Store({
    plugins: [
        createPersistedState({
            storage: {
                getItem: (key) => ls.get(key),
                setItem: (key, value) => ls.set(key, value),
                removeItem: (key) => ls.remove(key),
            },
        }),
    ],
    state: {
        //用户id
        userid: '',
        //用户token
        userToken: '',
        //当前显示链接
        activePath: '',
        //菜单
        menuList: [],
        //用户信息
        userInfo: {},
        //面包屑导航
        breadCrumbs: {}
    },
    actions: {
        increment({ commit }) {
            commit('increment')
        }
    },
    //改变值
    mutations: {
        //设置用户id
        setUserId(state, id) {
            state.userid = id;
        },
        //设置token
        setUserToken(state, token) {
            state.userToken = token;
        },
        setActivePath(state, activePath) {
            state.activePath = activePath;
        },
        setMenuList(state, menuList) {
            state.menuList = menuList;
        },
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        },
        setBreadCrumbs(state, breadCrumbs, ) {
            state.breadCrumbs = breadCrumbs;
        }
    },
    //获取vuex
    getters: {
        userid: state => {
            return state.userid;
        },
        userToken(state) {
            return state.userToken;
        },
        getActivePath(state) {
            return state.activePath;
        },
        getMenuList(state) {
            return state.menuList;
        },
        getUserInfo(state) {
            return state.userInfo;
        },
        getBreadCrumbs(state) {
            return state.breadCrumbs;
        }


    }
})
export default store