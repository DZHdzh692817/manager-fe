<template>
    <div>
        <h1>登录页面</h1>
        <el-button @click="goHome">回首页</el-button>
    </div>
</template>
<script>
// import { useRouter } from 'vue-router'
// const router = useRouter();
// const goHome = () => {
//     router.push({name: 'welcome'})
// }
export default {
    name: 'Login',
    mounted(){
        //这种写法好丑 
        // this.$request({
        //     method: 'get',
        //     url: '/login',
        //     data: { name: 'dzh'}
        // }).then((res)=>{
        //     console.log(res)
        // })
        // 改成下面这种写法 显得高大上
        this.$request.get('/login', {name:'dzh'},{mock:true,loading:true}).then((res)=>{
            console.log(res)
        })
    },
    methods: {
        goHome() {
            this.$router.push({name: 'welcome'})
        }
    }
}
</script>
<style scoped>
</style>
