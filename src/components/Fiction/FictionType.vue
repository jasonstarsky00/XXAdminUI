<template>
     <el-card>
        <!-- 搜索条件 -->
        <el-row>         
            <el-col :push="23" :span="1">
                <el-button size="small" @click="showAddFictionTypeDialog()" type="info">添加</el-button>
            </el-col>
        </el-row>
          <!-- 表格区域 -->
        <el-table :data="fictionTypeList"   style="width: 100%;margin-top:18px;">
            <el-table-column type="index" label="#" width="40px"></el-table-column>            
            <el-table-column prop="name" label="分类名称" align="center">  </el-table-column>
            <el-table-column label="标签" align="center">
                 <template slot-scope="scope">                   
                    <p>{{fictionType[scope.row.type]}}</p>
                </template>
          
            </el-table-column>
            <el-table-column width="260" align="center" label="操作">                 
                <template slot-scope="scope">
                    <el-button size="mini" @click="showEditFictionType(scope.row.id)" type="primary">编辑</el-button>
                    <el-button size="mini" @click="deleteFictionType(scope.row.id)" type="danger">删除</el-button>
                </template>
            </el-table-column>            
        </el-table>
        <!-- 添加小说分类弹窗 -->
         <el-dialog  :visible.sync="addFictionTypeDialogVisible" width="30%" center @close="addFictionTypeDialogColse">
            <div slot="title" class="dialog-title">
                <i size="mini" class="el-icon-edit-outline"></i>
                <span class="title-text">添加小说分类</span>                
            </div>
            <el-form :model="addFictionTypeInfo" :rules="addFictionTyperules" ref="addFictionTypeForm" label-width="100px" class="demo-ruleForm"> 
                 <el-form-item label="分类名称" prop="name"> 
                    <el-col :span="18" >
                        <el-input v-model="addFictionTypeInfo.name"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="标签"  prop="type">
                    <el-col :span="18">
                        <el-input v-model="addFictionTypeInfo.type" ></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addFictionTypeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addFictionTypeFrom">确 定</el-button>
            </span>
        </el-dialog>
         <!-- 编辑小说分类弹窗 -->
         <el-dialog  :visible.sync="editFictionTypeDialogVisible" width="30%" center @close="editFictionTypeDialogColse">
            <div slot="title" class="dialog-title">
                <i size="mini" class="el-icon-edit-outline"></i>
                <span class="title-text">添加小说分类</span>                
            </div>
            <el-form :model="editFictionTypeInfo" :rules="editFictionTyperules" ref="editFictionTypeForm" label-width="100px" class="demo-ruleForm"> 
                 <el-form-item label="分类名称" prop="name"> 
                    <el-col :span="18" >
                        <el-input v-model="editFictionTypeInfo.name"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="标签"  prop="type">
                    <el-col :span="18">
                        <el-input v-model="editFictionTypeInfo.type" ></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editFictionTypeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editFictionTypeFrom">确 定</el-button>
            </span>
        </el-dialog>
    </el-card>
</template>
<script>
export default {
    data(){
        return {
            //小说分类数据
            fictionTypeList:[],
            //小说分类
            fictionType:{
                "1":"男生",
                "2":"女生",
                "3":"标签",
            },
            //添加小说分类弹窗显示或隐藏
            addFictionTypeDialogVisible:false,
            //添加小说分类数据集合
            addFictionTypeInfo:{
                name:"",
                type:""
            },
            //添加小说分类校验规则
            addFictionTyperules:{
                name:[
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                type:[
                    { required: true, message: '请输入标签数字', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ]
            },
            //编辑小说分类弹窗显示或隐藏
            editFictionTypeDialogVisible:false,
            //编辑小说分类数据
            editFictionTypeInfo:{},            
            //添加小说分类校验规则
            editFictionTyperules:{
                name:[
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                type:[
                    { required: true, message: '请输入标签数字', trigger: 'blur' },
                   
                ]
            }
           
        }
    },
    methods:{
        //获取小说分类数据
        async getFictionType(){
            const {data:res} = await this.$http.get('Fiction/FictionTypeList')
            console.log(res)
            if(res.code!=200){
                return this.$msg.error(res.msg);
            }
            this.fictionTypeList=res.data.listFictionType;
        },
        //显示添加小说分类弹窗
        showAddFictionTypeDialog(){
            this.addFictionTypeDialogVisible=true;
        },
        //添加小说分类弹窗关闭事件监听
        addFictionTypeDialogColse(){
            this.$refs.addFictionTypeForm.resetFields();
        },
        //提交小说分类数据
        addFictionTypeFrom(){
            this.$refs.addFictionTypeForm.validate(async (valid)=>{
                if(!valid){
                    console.log(valid)
                    return this.$msg.error("请完整填写表单")
                }
                const {data:res} = await this.$http.post("Fiction/AddFictionType?name="+this.addFictionTypeInfo.name+"&type="+this.addFictionTypeInfo.type);
                if(res.code!=200){
                    return this.$msg.error(res.msg);
                }
                this.$msg.success(res.msg);
                this.addFictionTypeDialogVisible = false;
                this.getFictionType();
            })
        },
        //删除小说分类
        deleteFictionType(id){
            this.$confirm("此操作将永久删除该小说分类, 是否继续?",'提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const {data:res} = await this.$http.post("Fiction/DeleteFictionType?id="+id);
                if(res.code!=200){
                    return this.$msg.error(res.msg);
                }
                this.$msg.success(res.msg);
                this.getFictionType();
            }).catch(() => {
               
            });
        },
        //显示编辑弹窗
        showEditFictionType(id){
            this.getFictionTypeById(id);
            this.editFictionTypeDialogVisible=true;
        },
         //编辑小说分类弹窗关闭事件监听
        editFictionTypeDialogColse(){
            this.$refs.editFictionTypeForm.resetFields();
        },
        //获取单条小说分类信息
        async getFictionTypeById(id){
            const {data:res} = await this.$http.get("Fiction/GetFictionType?id="+id);
            if(res.code!=200){
                return this.$msg.error(res.msg);
            }
            this.editFictionTypeInfo = res.data.fictionType;
            console.log(this.fictionType)
        },
        //提交修改的小说分类信息
        editFictionTypeFrom(){
            this.$refs.editFictionTypeForm.validate(async (valid)=>{
                if(!valid){
                    console.log(valid)
                    return this.$msg.error("请完整填写表单")
                }
                const {data:res} = await this.$http.post("Fiction/EditFictionType?id="+this.editFictionTypeInfo.id+"&name="+this.editFictionTypeInfo.name+"&type="+this.editFictionTypeInfo.type);
                if(res.code!=200){
                    return this.$msg.error(res.msg);
                }
                this.$msg.success(res.msg);
                this.editFictionTypeDialogVisible = false;
                this.getFictionType();
            })
        }
    },
    created(){
        this.getFictionType();
    }
}
</script>