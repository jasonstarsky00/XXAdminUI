<template>
    <div class="login_container">
        <div class="login_box">
             <div class="pricture_box">
                <img src="../../assets/images/logo_big.png" alt="">
            </div>
            <div class="login_form">
                <el-form :model="loginForm" :rules="loginrules" ref="loginForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="账号" prop="userName">
                        <el-input v-model="loginForm.userName"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="passWord">
                        <el-input type="password" v-model="loginForm.passWord"></el-input>
                    </el-form-item>
                    <el-form-item class="btns">
                        <el-button type="primary" @click="login">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
             //登录数据绑定
            loginForm:{
                userName:"admin",
                passWord:"aa123456"
            },
            //验证规则
            loginrules:{
                userName:[
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 5, max: 16, message: '账号长度在5到16个字符', trigger: 'blur' }
                ],
                passWord:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 16, message: '账号长度在6到16个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        //登录
        login(){
            this.$refs.loginForm.validate(async valid=>{
                //验证未通过时
                if(!valid){
                    return;
                }
                var loginForm = this.loginForm
                var {data:res} = await this.$http.post('user/userlogin?userName='+this.loginForm.userName+'&passWord='+this.loginForm.passWord);
                if(res.code!=200){
                    this.$msg.error(res.msg);
                }
                //登录成功
                this.$msg.success(res.msg);                
                //保存toekn
                this.$store.commit("setUserToken",res.data.token);   
                
                //保存用户id
                this.$store.commit("setUserId",res.data.id);    
                console.log(res.data.id);           
                //跳转
                this.$router.push('/Main/Index');               
                console.log(this.$store.getters.userToken)
            })
           
        }
    }
}
</script>

<style lang="less" scoped>
.login_container{
    background-color: #00bfff;
    height: 100%;
    // background: url('../../assets/images/logo_big.png') no-repeat;
    // background-size: 60% 100%;
    background-position-x: 50%;
    .login_box{
        border-radius: 3px;
        width: 400px;
        height: 300px;
        background: #FFFFFF;
        position: absolute;
        top: 50%;
        left: 50%;
       
        transform: translate(-50%,-50%);
        .pricture_box{
            width: 130px;
            height: 130px;
            background: #FFFFFF;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);
            border-radius: 50%;
            border: 1px solid #ff8300;
            padding: 10px;
             box-shadow: 0 0 10px #ddd;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;                
            }
        }
        .login_form{
            position: absolute;
            bottom: 0;
            padding: 0 20px;
            box-sizing: border-box;
        }
        .btns{
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>