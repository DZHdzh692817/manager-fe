<template>
    <div class="basic-layout">
        <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
            <!-- 系统LOGO -->
            <div class="logo">
                <img src="./../assets/logo1.png" alt="" />
                <span>Manager</span>
            </div>
            <!-- 导航菜单 -->
            <el-menu :default-active="activeMenu" router class="el-menu-vertical-demo nav-menu" background-color="#001529" text-color="#fff" :collapse="isCollapse">
                <tree-menu :userMenu="userMenu"/>
            </el-menu>
        </div>
        <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
            <div class="nav-top">
                <div class="nav-left">
                    <div class="menu-fold" @click="toggle">
                        <el-icon v-if="isCollapse"><expand /></el-icon>
                        <el-icon v-else><fold /></el-icon>
                    </div>
                    <div class="bread">
                        <!-- 面包屑 -->
                        <BreadCrumb />
                    </div>
                </div>
                <div class="user-info">
                    <el-badge :is-dot="noticeCount > 0 ? true : false" class="notice" type="danger">
                        <el-icon :size="20"><bell /></el-icon>
                    </el-badge>
                    <el-dropdown @command="handleLogout">
                        <span class="user-link">
                            {{userInfo.userName}}
                            <el-icon class="el-icon--right"><arrow-down /></el-icon>
                        </span>
                        <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="email">邮箱:{{userInfo.userEmail}}</el-dropdown-item>
                            <el-dropdown-item command="logout">退出</el-dropdown-item>
                        </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
            <div class="wrapper">
                <!-- <div class="main-page"></div> -->
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import TreeMenu from './TreeMenu.vue'
import BreadCrumb from './BreadCrumb.vue'
import { defineComponent } from 'vue'
import { ElMessage } from 'element-plus'
import { Location,Document, Setting, Expand, Bell, ArrowDown, Fold } from '@element-plus/icons'
export default defineComponent({
    name:'Home',
    components: { Location, Document, Setting, Expand, Bell, ArrowDown, Fold, TreeMenu,BreadCrumb },
    data() {
        return {
            userInfo:this.$store.state.userInfo || {},
            isCollapse: false,
            noticeCount: 0,
            userMenu: [],
            activeMenu: location.hash.slice(1)
        }
    },
    mounted() {
        this.getNoticeCount()
        this.getMenuList()
    },
    methods:{
        toggle() {
            this.isCollapse = !this.isCollapse
        },
        handleLogout(key) {
            if(key == 'email')return;
            this.$store.commit('saveUserInfo', '')
            this.userInfo = null
            this.$router.push('login')
        },
        async getNoticeCount() {
            try {
                const count = await this.$api.noticeCount()
                this.noticeCount = count
            } catch (error) {
                console.log(error)
            }  
        },
        async getMenuList() {
            try {
                const list = await this.$api.getMenuList()
                this.userMenu = list
            } catch (error) {
                console.log(error)
            }
        }
    }
})
</script>

<style lang="scss" scoped>
.basic-layout{
    position: relative;
    .nav-side{
        position: fixed;
        width: 200px;
        height: 100vh;
        background-color: #001529;
        color: #fff;
        overflow-y: auto;
        overflow: hidden;
        transition: width .5s;
        .logo {
            display: flex;
            align-items: center;
            font-size: 18px;
            height: 50px;
            img {
                width: 32px;
                height: 32px;
                margin: 0 16px;
            }
        }
        .nav-menu {
            height: calc(100vh - 50px);
            border-right: none;
        }
        //合并
        &.fold{
            width: 64px;
        }
        //展开
        &.unfold{
            width: 200px;
        }
    }
    .content-right{
        margin-left: 200px;
        //合并
        &.fold{
            margin-left: 64px;
        }
        //展开
        &.unfold{
            margin-left: 200px;
        }
        .nav-top{
            height: 50px;
            line-height: 50px;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px sold #ddd;
            padding: 0 20px;
            .nav-left {
                display: flex;
                align-items: center;
                .menu-fold {
                    margin-right: 15px;
                    font-size: 18px;
                }
            }
            .user-info {
                .notice {
                    line-height: 30px;
                    margin-right:15px;
                }
                .user-link {
                    cursor: pointer;
                    color: #409eff;
                }
            }
        }
        .wrapper{
            background: #eef0f3;
            padding: 20px;
            height: calc(100vh - 50px);
            .main-page{
                background-color: #fff;
                height: 100%;
            }
        }
    }
}
</style>
