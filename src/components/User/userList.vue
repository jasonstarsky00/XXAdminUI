<template>
    <el-card>
        <!-- 头部搜索区域 -->
        <el-row>
            <el-col :span="2">
                <el-input size="small" v-model="queryInfo.userName" placeholder="用户名"></el-input>
            </el-col>
            <el-col :span="2" style="padding-left:10px;">
                <el-input size="small" v-model="queryInfo.name" placeholder="昵称"></el-input>
            </el-col>
            <!-- 角色类型 -->
            <el-col :span="2" style="padding-left:10px;">
                <el-select v-model="queryInfo.userRole"  clearable placeholder="角色类型">
                    <el-option class="test"
                        v-for="item in userRoleList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <!-- 是否Vip -->
            <el-col :span="2" style="padding-left:10px;">
                <el-select v-model="queryInfo.isVip"  clearable placeholder="是否Vip">
                    <el-option class="test"
                        v-for="item in userIsVip"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <!-- 是否冻结 -->
            <el-col :span="2" style="padding-left:10px;">
                <el-select v-model="queryInfo.isFreeze"  clearable placeholder="是否冻结">
                    <el-option class="test"
                        v-for="item in userIsFreeze"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <!-- 是否激活 -->
            <el-col :span="2" style="padding-left:10px;">
                <el-select v-model="queryInfo.isActivation"  clearable placeholder="是否激活">
                    <el-option class="test"
                        v-for="item in userIsActivation"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col class="search-col" :span="1">
                  <el-button size="small" @click="searchUsers()" type="primary">搜索</el-button>
            </el-col>
            <el-col :push="10" :span="1">
                <el-button size="small" type="info">添加</el-button>
            </el-col>
        </el-row>
         <!-- 表格区域 -->
        <el-table :data="userList"   style="width: 100%;margin-top:18px;">
            <el-table-column type="index" label="#" width="40px"></el-table-column>            
            <el-table-column prop="userName" label="用户名" align="center">  </el-table-column>
            <el-table-column prop="name" label="昵称" align="center"></el-table-column> 
            <el-table-column prop="phone" label="手机" align="center"></el-table-column> 
            <el-table-column prop="email" label="邮箱" align="center"></el-table-column>            
            <el-table-column prop="vipGrade" label="等级" align="center"></el-table-column>
            <el-table-column prop="intergral" label="积分" align="center"></el-table-column>
            <el-table-column width="180" label="最后登录时间" align="center">
                <template slot-scope="scope">                   
                    <p>{{DealwithTime(scope.row.lastLoginTime)}}</p>
                </template>
            </el-table-column>
            <el-table-column  label="vip" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.isVip==0" size="mini" color="#92939a">×</el-tag>
                    <el-tag v-else color="#ff8300" size="mini">√</el-tag>
                </template>
            </el-table-column> 
            <el-table-column label="冻结" align="center">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.isFreeze" :active-value="isFreezeValue" :inactive-value="inIsFreezeValue"
                     active-color="#ff8300" inactive-color="#92939a" @change="editIsFreeze(scope.row)">
                    </el-switch>                    
                </template>
                
            </el-table-column> 
            <el-table-column label="激活" align="center">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.isActivation" :active-value="isActivationValue" :inactive-value="inIsActivationValue"
                     active-color="#ff8300" inactive-color="#92939a" @change="editIsActivation(scope.row)">
                    </el-switch>                    
                </template>
            </el-table-column>   
            <el-table-column label="角色" align="center">
                <template slot-scope="scope">                   
                    <p>{{userRoleType[scope.row.userRole]}}</p>
                </template>
            </el-table-column>
            <el-table-column width="160" align="center" label="操作">                 
                <template slot-scope="scope">
                    <el-button size="mini" @click="getPermission(scope.row.id)" type="primary">编辑</el-button>
                    <el-button size="mini" @click="deletePermission(scope.row.id)" type="danger">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
            @size-change="usersPageSizeChange"
            @current-change="userPageIndexChange"
            :current-page="queryInfo.pageIndex"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </el-card>
</template>
<script>
export default {
    data(){
        return{            
            //角色类型
            userRoleList:[
                {value: 1,label: '超级管理员'},
                {value: 2,label: '管理员'}
            ],
            //是否Vip
            userIsVip:[                   
                {value: 1,label: '是'},
                {value: 0,label: '否'}
            ],
            //是否冻结
            userIsFreeze:[                
                {value: 0,label: '否'},
                {value: 1,label: '是'}
            ],
            //激活状态
            userIsActivation:[
                {value: 1,label: '已激活'},
                {value: 0,label: '未激活'}
            ],
            //用户列表数据
            userList:[],
            //角色类型
            userRoleType:{
                "1":"管理员",
                "2":"超级管理"
            },
             //激活状态
            isActivationValue:1,
             //未激活状态
            inIsActivationValue:0,
            //冻结状态
            isFreezeValue:1,
            //未冻结状态
            inIsFreezeValue:0,
            //查询用户条件集合
            queryInfo:{
                //分页显示数量
                pageSize:10,
                //分页当前页码
                pageIndex:1,
                //用户名
                userName:'',
                //昵称
                name:'',
                //角色类型
                userRole:'',
                //是否vip
                isVip:'',
                 //是否冻结
                isFreeze:'',
                //是否激活
                isActivation:''
            },
            //总数
            total:0
            
        }
    },
    methods:{
        //获取用户数据
        async getUsers(){
            const {data:res} = await this.$http.get("user/UserList",{params:this.queryInfo});
            console.log(res);
            if(res.code!=200){
                return this.$msg.error(res.msg);
            }
            this.userList= res.data.userList;
            this.total = res.data.total;
            this.queryInfo.pageSize =res.data.pageSize;
            this.queryInfo.userName =res.data.userName;

        },
        //处理时间
        DealwithTime(time){
           return new Date(time).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        },
        //修改激活状态
        editIsActivation(row){

        },
        //修改冻结状态
        editIsFreeze(row){

        },
        //分页显示数量改变事件
        usersPageSizeChange(newSize){
            this.queryInfo.pageSize= newSize;
            this.getUsers();
        },
        //分页当前显示页码改变事件
        userPageIndexChange(newSize){
            this.queryInfo.pageIndex= newSize;
            this.getUsers();
        },
        //查找相关用户信息
        searchUsers(){
            this.getUsers();
        }
    },
    created(){
        this.getUsers();
    }
}
</script>
<style lang="less" scoped>
// vue会生成样式，不破坏原有样式，/deep/可以达到深度覆盖，否则无法改变样式
/deep/.el-input__inner {                  
            height: 32px;                   
        }
/deep/.el-input__suffix{
    top:5px;
}
.search-col{
    padding-left: 10px;
}
.el-tag{
    color: #FFFFFF;
    border-color:none;
}
</style>