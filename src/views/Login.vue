<template>
    <div class="login-wrapper">
        <div class="modal">
            <el-form ref="userForm" :model="user" status-icon :rules="rules">
                <div class="title">登录</div>
                <el-form-item prop="userName">
                    <span class="iconfont icon">&#xe75e;</span>
                    <el-input type="text" v-model="user.userName"></el-input>
                </el-form-item>
                <el-form-item prop="userPwd">
                    <span class="iconfont">&#xe607;</span>
                    <el-input type="password" v-model="user.userPwd"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="btn-login" @click="login">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Login',
    data() {
        return {
            user: {
                userName: '',
                userPwd: ''
            },
            rules: {
                userName: [{required: true,message: "请输入用户名", trigger: "blur"}],
                userPwd: [{required: true, message: "请输入密码", trigger: "blur"}],
            }
        }
    },
    methods: {
        login() {
            this.$refs.userForm.validate((valid) => {
                if (valid) {
                    this.$api.login(this.user).then((res)=>{
                        //console.log(res)
                        this.$store.commit("saveUserInfo", res);
                        this.$router.push("/welcome");
                    })
                } else {
                    return false;
                }
            });
        },
    } 
}
</script>
<style lang="scss">
.login-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f9fcff;
    width: 100vw;
    height: 100vh;
    .modal{
        width: 500px;
        padding: 50px;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0px 0px 10px 3px #c7c9cb4d;
    }
    .title {
        font-size: 30px;
        line-height: 1.5;
        text-align: center;
    }
    .btn-login {
        width: 100%;
    }
}
</style>
