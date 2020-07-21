<template>
    <el-card>
        <!-- 头部搜索区域 -->
        <el-row>
            <el-col :span="2">
                <el-input size="small" v-model="queryInfo.bookName" placeholder="书名"></el-input>
            </el-col>
            <el-col :span="2" style="padding-left:10px;">
                <el-input size="small" v-model="queryInfo.bookAuthor" placeholder="作者"></el-input>
            </el-col>
            <el-col class="search-col" style="padding-left:10px;" :span="1">
                  <el-button size="small" @click="searchFictions()" type="primary">搜索</el-button>
            </el-col>
        </el-row>
        <el-table :data="fictions"   style="width: 100%;margin-top:18px;">
            <el-table-column type="index" label="#" width="40px"></el-table-column>            
            <el-table-column prop="BookName" label="书名" align="center">  </el-table-column>
            <el-table-column prop="Book_Author" label="作者" align="center"></el-table-column> 
            <el-table-column prop="Book_Status" label="状态" align="center"></el-table-column> 
            <el-table-column prop="Book_Classify" label="分类" align="center"></el-table-column> 
            <el-table-column  label="图片" align="center">
                  <template slot-scope="scope">
                    <p class="table_Multiline">{{scope.row.ImgSrc}}</p>
                </template>
            </el-table-column> 
            <el-table-column  label="小说链接" align="center">
                 <template slot-scope="scope">
                    <p class="table_Multiline">{{scope.row.BookLink}}</p>
                </template>
            </el-table-column> 
            <el-table-column prop="NewChapter_Name" label="最新章节" align="center">
                <template slot-scope="scope">
                    <p class="table_Multiline">{{scope.row.NewChapter_Name}}</p>
                </template>
            </el-table-column> 
            <el-table-column  label="最新链接" align="center">
                <template slot-scope="scope">
                    <p class="table_Multiline">{{scope.row.NewChapter_Link}}</p>
                </template>
            </el-table-column>
            <el-table-column label="作者主页链接" align="center">
                <template slot-scope="scope">
                    <p class="table_Multiline">{{scope.row.Book_Author_Link}}</p>
                </template>
            </el-table-column> 
            <el-table-column label="简介" align="center">
                <template slot-scope="scope">
                    <p class="table_Multiline">{{scope.row.Synopsis}}</p>
                </template>
            </el-table-column> 
            <el-table-column width="160" align="center" label="操作">                 
                <template slot-scope="scope">
                     <el-button size="mini" @click="showFictionInfoDialog(scope.row.id)" type="primary">目录</el-button>
                    <el-button size="mini" @click="deleteFiction(scope.row.id)" type="danger">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
         <!-- 分页 -->
        <el-pagination
            @size-change="fictionsPageSizeChange"
            @current-change="fictionsPageIndexChange"
            :current-page="queryInfo.pageIndex"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <!-- 编辑用户 -->
        <el-dialog  :visible.sync="fictionDialogVisible" width="80%" top="5vh" center @close="FictionDialogColse">
            <div slot="title" class="dialog-title">
                <i size="mini" class="el-icon-edit-outline"></i>
                <span class="title-text">小说详情</span>                
            </div>
            <div class="fictionBox">
                <div class="fiction_header">
                    <div class="left">
                        <div class="imgbox">
                            <img src="../../assets/images/fictiondemo.png" alt="">
                        </div>
                    </div>
                    <div class="right">
                        <div class="info_top">
                            <div class="title">
                                <p class="content">{{fiction.BookName}}</p>
                            </div>
                            <div class="other">
                                <div class="Auther">
                                    <span>作者：</span>
                                    <p>{{fiction.Book_Author}}</p>
                                </div>
                                <div class="update">
                                    <span>最后更新时间：</span>
                                    <p>2020-07-08 20:30:16         今日未更新</p>
                                </div>
                            </div>
                        </div>
                        <div class="info_footer">
                            <p>{{fiction.Synopsis}}</p>
                        </div>
                    </div>
                </div>
                <div class="main">
                    <ul>
                        <li v-for=" item in fictionCatalogs" :key="item.id">{{item.name}}</li>                        
                    </ul>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="fictionDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="">确 定</el-button>
            </span>
        </el-dialog>
    </el-card>
    
</template>
<script>
export default {
    data(){
        return{
            //小说数据
            fictions:[],
            //总数
            total:0,
            //查询用户条件集合
            queryInfo:{
                //分页显示数量
                pageSize:10,
                //分页当前页码
                pageIndex:1,
                //小说书名
                bookName:'',
                //作者
                bookAuthor:''
            },
            //小说详情弹窗显示隐藏控制
            fictionDialogVisible:false,
            //单本小说
            fiction:{},
            //小说的全部章节
            fictionCatalogs:[]
        }
    },
    methods:{
        //获取小说数据
        async getFictions(){
            const {data:res} = await this.$http.get('Fiction/FictionList',{params:this.queryInfo})
            
            if(res.code!=200){
                return this.$msg.error(res.msg);
            }
            this.fictions=res.data.fictionList;
            this.total = res.data.total;
             this.queryInfo.pageSize =res.data.pageSize;
            console.log(this.fictions)
        },
        //分页显示数量改变事件
        fictionsPageSizeChange(newSize){
            this.queryInfo.pageSize= newSize;
            this.getFictions();
        },
        //分页当前显示页码改变事件
        fictionsPageIndexChange(newSize){
            this.queryInfo.pageIndex= newSize;
            this.getFictions();
        },
        //搜索小说
        searchFictions(){
            this.getFictions();
        },
        //删除小说
        deleteFiction(id){
             this.$confirm("此操作将永久删除该小说, 是否继续?",'提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const {data:res} = await this.$http.post("Fiction/DeleteFiction?id="+id);
                if(res.code!=200){
                    return this.$msg.error(res.msg);
                }
                this.$msg.success(res.msg);
                this.getFictions();
            }).catch(() => {
               
            });
        },
        //显示小说详情弹窗
        showFictionInfoDialog(id){
            this.getFiction(id);
            this.getFictionCatalogs(id);
            this.fictionDialogVisible=true;
        },
        //小说弹窗关闭事件监听
        FictionDialogColse(){
            this.fiction = {};
            this.fictionCatalogs=[];
        },
        //获取单本小说
        async getFiction(id){
            const {data:res} = await this.$http.get("Fiction/GetFiction?id="+id);
            if(res.code!=200){
                return this.$msg.error(res.msg);
            }
            this.fiction = res.data.fiction;
            console.log(this.fiction)
        },
        //获取小说的全部章节
        async getFictionCatalogs(id){
             const {data:res} = await this.$http.get("Fiction/GetFictionCatalog?id="+id);
            if(res.code!=200){
                return this.$msg.error(res.msg);
            }
            this.fictionCatalogs = res.data.catalogList;
            console.log(this.fictionCatalogs)
        }
    },
    created(){
        this.getFictions();
    }
}
</script>
<style lang="less" scoped>
.table_Multiline{
    word-break: break-all;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
//小说详情弹窗
.fictionBox{
    border: 1px solid #d4d4d4;
    border-radius: 6px;
    padding: 8px 0px;
    .fiction_header{
        width:100%;
        overflow: hidden;
        padding-bottom: 4px;
        border-bottom:1px solid #d4d4d4;
        .left{
            width: 20%;
            float: left;
            .imgbox{
                width: 100%;
                text-align: center;
                img{
                    border: 1px solid #d0d0d0;
                    padding: 2px;
                    background-color: #d0d0d0;
                }
            }
        }
        .right{
            width: 80%;
            float: left;
            .info_top{
                border-bottom: 1px dashed #d0d0d0;
                .title{
                    font-size:28px;
                    height: 40px;
                    .content{
                        line-height: 40px;
                        height: 100%;
                        margin: 0;
                        color:#555555;

                    }                    
                }
                .Auther,.update{
                    height: 40px;
                }
                span{
                        display: inline-block;
                        color: #949494;
                    }
                p{
                    display: inline-block
                }
                
            }
            .info_footer{
                p{
                    width: 80%;
                    font-size: 14px;
                    color: #555;
                    text-indent: 2em;
                }
            }
        }
    }
    .main{
        width: 100%;
        margin-top: 10px;
        ul{
            padding: 0 5%;
            width: 90%;
            overflow: auto;
            height: 400px;
            li{
                float: left;
                width: 25%;
                border-bottom: 1px dashed #949494;
                text-align: left;
                padding: 6px 0px;
                color: #555;
                white-space: nowrap; //强制文本在一行内输出
                overflow: hidden; //隐藏溢出部分
                text-overflow: ellipsis; //对溢出部分加上...
            }
        }
    }
    
}
</style>