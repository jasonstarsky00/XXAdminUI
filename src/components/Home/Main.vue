<template>
    <el-container class="home_container">
         <!-- 左侧菜单区域 -->
        <el-aside :width="collapse?'56px':'200px'">
            <el-menu  class="el-menu-vertical-demo" text-color="#FFF" background-color="#304156" :collapse="collapse"
            :collapse-transition="false" active-text-color="#ff8300" router :default-active="this.$store.getters.getActivePath" >
                
                <el-submenu :index="item.permissId+''" v-for="item in menuList" :key="item.permissId">
                    <template slot="title">
                        <i :class="menusListIcon[item.permissId]"></i>
                        <span slot="title">{{item.permissName}}</span>
                    </template>
                    <el-menu-item :index="'/'+childItem.controller+'/'+childItem.action" v-for="childItem in item.childMenus" :key="childItem.permissId"  @click="saveNavStatus('/'+childItem.controller+'/'+childItem.action,item.permissName,childItem.permissName)">                                                      
                        <i :class="menusListIcon[childItem.permissId]"></i>
                        <span slot="title">{{childItem.permissName}}</span>
                    
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>
        <!-- 内容显示区域 -->
        <el-container>
            <el-main>
                <el-row>
                    <!-- 折叠按钮 -->
                    <el-col class="fold" :span="1">
                        <i size="medium" @click="toggleCollapse" :class="collapse==false?'el-icon-s-fold':'el-icon-s-unfold'"></i>
                    </el-col>
                    <!-- 导航面包屑 -->
                    <el-col class="breadCrumbs" :span="6">
                        <el-breadcrumb  separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item>{{this.$store.getters.getBreadCrumbs.parentMenuName===undefined?"用户管理":this.$store.getters.getBreadCrumbs.parentMenuName}}</el-breadcrumb-item>
                            <el-breadcrumb-item>{{this.$store.getters.getBreadCrumbs.curMenuName==undefined?"用户列表":this.$store.getters.getBreadCrumbs.curMenuName}}</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                    <!-- 头像 -->
                    <div class="user">
                        <div class="user_img">
                            <el-dropdown trigger="click">
                                <img src="../../assets/images/user_img.jpg" alt="">
                            <i class="el-icon-caret-bottom"></i>
                                <el-dropdown-menu slot="dropdown" >
                                    <el-dropdown-item icon="el-icon-user" @click.native="personalcenter" native divided>个人中心</el-dropdown-item>
                                    <el-dropdown-item icon="el-icon-s-home">首页</el-dropdown-item>                                    
                                    <el-dropdown-item icon="el-icon-switch-button" @click.native="loginOut" native divided>退出登录</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                </el-row>
                 <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
export default {
    data(){
        return{
             //菜单数据
            menuList:[],
             //是否折叠
            collapse:false,
             //图标
            menusListIcon:{
                //一级菜单
                "1":"el-icon-menu",
                "2":"el-icon-s-tools",
                "4":"el-icon-s-platform",
                //二级
                "100101":"el-icon-s-custom",
                "100102":"el-icon-s-platform",
                "200101":"el-icon-s-operation",
                "200102":"el-icon-s-promotion",
                "12":"el-icon-user",
                "400101":"el-icon-s-cooperation"
            },
            //当前点击的链接
            activePath:"",
            
        }
    },
    methods:{
        //获取菜单
        async getMues(){
          // console.log(this.users.id==null)
          // if(this.users.id!=null){
                var {data:res} = await this.$http.get("Permission/GetMenus?id="+this.$store.getters.userid);            
                if(res.code!=200){
                    this.$msg.error(res.msg);
                    return;
                }
                console.log(res.data)    
                this.menuList = res.data;
                 //缓存菜单
                this.$store.commit("setMenuList",res.data);
                console.log("用户id"+this.$store.getters.userid);
           //}
        },
        //菜单栏折叠
        toggleCollapse(){
            this.collapse = !this.collapse;
        },
         //保存菜单点击状态
        saveNavStatus(activePath,parentMenuName,curMenuName){
            this.$store.commit("setActivePath",activePath);           
            //二次点击后，重新保存当前点击的链接状态
            this.activePath = this.$store.getters.activepath;
            //保存面包屑信息
            var  breadCrumbs= {"parentMenuName":parentMenuName,"curMenuName":curMenuName}
            this.$store.commit("setBreadCrumbs",breadCrumbs);
            this.breadCrumbs =this.$store.getters.getBreadCrumbs;
        },
        //跳到个人中心
        personalcenter(){
            this.$router.push("/user/PersonalCenter");
            
        },
        //退出登录
        loginOut(){
                this.$confirm('是否要退出？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //清除token 跳转至登录页
                    this.$store.commit("setUserToken","");            
                    this.$router.push("/");
                }).catch(() => {
                    return;        
                });          
            
        },
    },
    created(){
        this.getMues();
         //如果未缓存菜单      
        if(this.$store.getters.getMenuList.length==0){          
           this.getMues();           
        }else{
            this.menuList = this.$store.getters.getMenuList;
            
        }
    }

}
</script>
<style lang="less" scoped>
.home_container{
    height:100%;
} 
.el-aside{
    background: #304156;
    >ul{
        border-right: none;        
    }
}
.el-main{
    padding: 0;    
    .fold{
        width: 3%;
        font-size: 26px;
        .el-icon-s-fold,.el-icon-s-unfold{
            margin-left: 8px;
            cursor: pointer;
            color:#304156;
        }
        .el-icon-s-fold:hover,.el-icon-s-unfold:hover{
            color: #ff8300;
        }
    }
    .breadCrumbs{
        height: 35px;
        .el-breadcrumb{
            height: 35px;
            line-height: 35px;
        }
    }
    .user{
        position: absolute;
        right: 0;
        height: 35px;
        cursor: pointer;
        .user_img{
            position: relative;
            height: 35px;
            img{
                padding: 2.5px 2.5px;
                height: 30px;
                width: 30px;
                border-radius: 50%;
            }    
            .user_operation{
                background: #000;
                position: absolute;
                width: 100px;
                height:200px;
                top: 35px;
                right: 0px;
                color: #ffffff;
                transition: width 2s, height 2s;
                ul{
                    padding: 0px;
                    li{
                        padding: 4px;
                        width: 100px;
                        height: 36px;
                        text-align: center;
                    }
                }
            }
                
        }
       
    }
    .el-row{
        box-shadow: 0 1px 4px rgba(0,21,41,.08);
    }
     
}
</style>