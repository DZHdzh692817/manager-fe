<template>
    <div class="login-wrapper">
        <div class="modal">
            <el-form ref="userForm" :model="user" status-icon :rules="rules">
                <div class="title">登录</div>
                <el-form-item prop="userName">
                    <!-- <span class="iconfont icon">&#xe75e;</span>
                    <el-input type="text" v-model="user.userName"></el-input> -->
                    <el-input type="text" v-model="user.userName" placeholder="输入用户名">
                        <template #prefix>
                            <el-icon class="el-input__icon"><icon-user /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="userPwd">
                    <!-- <span class="iconfont">&#xe607;</span>
                    <el-input type="password" v-model="user.userPwd"/> -->
                    <el-input type="password" v-model="user.userPwd" placeholder="输入密码">
                        <template #prefix>
                            <el-icon class="el-input__icon"><icon-unlock /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="btn-login" @click="login">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { Unlock as IconUnlock, User as IconUser} from '@element-plus/icons'
export default {
    name: 'Login',
    components: { IconUnlock, IconUser },
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
        margin-bottom: 20px;
    }
    .btn-login {
        margin-top: 10px;
        width: 100%;
    }
}
</style>
