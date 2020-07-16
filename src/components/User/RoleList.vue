<template>
    <el-card>
        <!-- 搜索条件 -->
        <el-row>
            <el-col :span="2">
                <el-input size="small" v-model="queryInfo.roleName" placeholder="角色名"></el-input>
            </el-col>
            <el-col :span="2" style="padding-left:10px;padding-right:10px;">
                <el-select v-model="queryInfo.isEnable"  clearable placeholder="是否激活">
                    <el-option class="test"
                        v-for="item in roleSearchIsEnable"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col class="search-col" :span="1">
                  <el-button size="small" @click="searchUsers()" type="primary">搜索</el-button>
            </el-col>
            <el-col :push="18" :span="1">
                <el-button size="small" @click="showAddRoleDialog()" type="info">添加</el-button>
            </el-col>
        </el-row>
          <!-- 表格区域 -->
        <el-table :data="roleList"   style="width: 100%;margin-top:18px;">
            <el-table-column type="index" label="#" width="40px"></el-table-column>            
            <el-table-column prop="roleName" label="角色名称" align="center">  </el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.isEnable" :active-value="isEnableValue" :inactive-value="inisEnableValue"
                     active-color="#ff8300" inactive-color="#92939a" @change="editIsEnable(scope.row)">
                    </el-switch>                    
                </template>                
            </el-table-column> 
            <el-table-column width="260" align="center" label="操作">                 
                <template slot-scope="scope">
                    <el-button size="mini" icon="el-icon-setting" @click="permission(scope.row.id)"  type="warning">授权</el-button>
                    <el-button size="mini" @click="editRole(scope.row.id)" type="primary">编辑</el-button>
                    <el-button size="mini" @click="deleteRole(scope.row.id)" type="danger">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 添加角色 -->
        <el-dialog  :visible.sync="addRoleDialogVisible" width="30%" center @close="addRoleDialogColse">
            <div slot="title" class="dialog-title">
                <i size="mini" class="el-icon-edit-outline"></i>
                <span class="title-text">添加角色</span>                
            </div>
            <el-form :model="addRoleInfo" :rules="addRolerules" ref="addRoleForm" label-width="100px" class="demo-ruleForm"> 
                <el-form-item label="角色名称"  prop="roleName">
                    <el-col :span="18">
                        <el-input v-model="addRoleInfo.roleName" ></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="状态" prop="isEnable">
                    <el-select v-model="addRoleInfo.isEnable"  clearable placeholder="是否启用">
                        <el-option class="test"
                            v-for="item in addRoleIsEnable"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>               
            </el-form>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRoleFrom">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑角色 -->
        <el-dialog  :visible.sync="editRoleDialogVisible" width="30%" center @close="editRoleDialogColse">
            <div slot="title" class="dialog-title">
                <i size="mini" class="el-icon-edit-outline"></i>
                <span class="title-text">编辑角色</span>                
            </div>
            <el-form :model="editRoleInfo" :rules="editRolerules" ref="editRoleForm" label-width="100px" class="demo-ruleForm"> 
                <el-form-item label="角色名称"  prop="roleName">
                    <el-col :span="18">
                        <el-input v-model="editRoleInfo.roleName" ></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="状态" prop="isEnable">
                    <el-select v-model="editRoleInfo.isEnable"  clearable placeholder="是否启用">
                        <el-option class="test"
                            v-for="item in addRoleIsEnable"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>               
            </el-form>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRoleFrom">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 授权 -->
        <el-dialog  :visible.sync="permissionDialogVisible" width="30%" center @close="permissionDialogColse">
            <div slot="title" class="dialog-title">
                <i size="mini" class="el-icon-edit-outline"></i>
                <span class="title-text">角色授权</span>                
            </div>
            <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="permissionDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="permissionFrom">确 定</el-button>
            </span>
        </el-dialog>

    </el-card>
</template>
<script>
export default {
    data(){
        return{
            queryInfo:{
                //角色名
                roleName:'',
                //状态
                isEnable:''
            },
            //激活状态
            roleSearchIsEnable:[
                {value: 1,label: '启用'},
                {value: 0,label: '禁用'}
            ],
            //角色数据
            roleList:[],
            //启用
            isEnableValue:1,
            //未启用
            inisEnableValue:0,
            //添加角色弹窗控制
            addRoleDialogVisible:false,
            //添加角色数据
            addRoleInfo:{
                roleName:'',
                isEnable:''
            },
            //激活状态
            addRoleIsEnable:[
                {value: 1,label: '启用'},
                {value: 0,label: '禁用'}
            ],
            //添加角色校验规则
            addRolerules:{
                roleName:[
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
                ],
                isEnable:[
                    { required: true, message: '请选择状态', trigger: 'change' }
                ]
            },
            //控制编辑角色弹窗显示隐藏
            editRoleDialogVisible:false,
            //编辑角色的数据
            editRoleInfo:{},
            //编辑角色校验规则
            editRolerules:{
                roleName:[
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
                ],
                isEnable:[
                    { required: true, message: '请选择状态', trigger: 'change' }
                ]
            },
            //控制授权弹窗显示隐藏
            permissionDialogVisible:false
        }
    },
    methods:{
        //获取角色数据
        async getRoles(){
            const {data:res} = await this.$http.get('role/RoleList',{params:this.queryInfo})
            console.log(res)
            if(res.code!=200){
                return this.$msg.error(res.msg);
            }
            this.roleList=res.data.roleList;
        },            
        //修改状态
        async editIsEnable(row){            
            const isEnable = row.isEnable==1?1:0;
            
            const {data:res} = await this.$http.post('role/EditIsEnable?id='+row.id+'&isEnable='+isEnable);
            if(res.code!=200){
                return this.$msg.error(res.msg);
            }
            this.$msg.success(res.msg);
            this.getRoles();
        },
        //查找
        searchUsers(){
            this.getRoles();
        },
        //关闭添加角色弹窗监听
        addRoleDialogColse(){
            this.$refs.addRoleForm.resetFields();
        },
        //显示添加角色界面
        showAddRoleDialog(){
            this.addRoleDialogVisible = true;
        },
        //添加角色
        addRoleFrom(){
            this.$refs.addRoleForm.validate(async (valid)=>{
                if(!valid){
                    console.log(valid)
                    return this.$msg.error("请完整填写表单")
                }
                const {data:res} = await this.$http.post("role/AddRole?roleName="+this.addRoleInfo.roleName+"&isEnable="+this.addRoleInfo.isEnable);
                if(res.code!=200){
                    return this.$msg.error(res.msg);
                }
                this.$msg.success(res.msg);
                this.addRoleDialogVisible=false;
                this.getRoles();
            })
        },
        //获取角色信息
        async editRole(id){
            const {data:res} = await this.$http.get('role/GetRole?id='+id);
            if(res.code!=200){
                return this.$msg.error(res.msg);
            }
             console.log(res)
            this.editRoleInfo = res.data;
            this.editRoleDialogVisible=true;
        },
        //监听编辑角色弹窗关闭事件
        editRoleDialogColse(){
            this.$refs.editRoleForm.resetFields();
        },
        //提交编辑角色数据
        editRoleFrom(){
             this.$refs.editRoleForm.validate(async (valid)=>{
                if(!valid){
                    console.log(valid)
                    return this.$msg.error("请完整填写表单")
                }
                const {data:res} = await this.$http.post("role/EditRole?roleName="+this.editRoleInfo.roleName+"&isEnable="+this.editRoleInfo.isEnable+"&id="+this.editRoleInfo.id);
                if(res.code!=200){
                    return this.$msg.error(res.msg);
                }
                this.$msg.success(res.msg);
                this.editRoleDialogVisible=false;
                this.getRoles();
            })
        },
        //删除角色
        deleteRole(id){
            this.$confirm("此操作将永久删除该角色, 是否继续?",'提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const {data:res} = await this.$http.post("role/DeleteRole?id="+id);
                if(res.code!=200){
                    return this.$msg.error(res.msg);
                }
                this.$msg.success(res.msg);
                this.getRoles();
            }).catch(() => {
               
            });
        },
        //授权弹窗关闭事件监听
        permissionDialogColse(){

        },
        //提交授权权限
        permissionFrom(){

        },
        //授权弹窗、获取角色已有权限、全部权限
        permission(id){
            this.permissionDialogVisible=true;
        },
        //Tree事件
        handleNodeClick(){

        }

    },
    created(){
        this.getRoles();
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
</style>