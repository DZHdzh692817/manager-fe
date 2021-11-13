<template>
  <router-view></router-view>
</template>

<script>
export default {
    name: 'app',
    mounted(){
        //添加storage
        //this.$storage.setItem('userInfo',{age:30,name:'dfd'})
        //获取storage里面的值 因为都已经封装好了
        //console.log('user=>', this.$storage.getItem('userInfo'))
        //删除某一个
        //this.$storage.clearItem('name')
        //删除所有
        //this.$storage.clearAll()
    }
}
</script>

<style lang="scss">
@import './assets/style/reset.css';
@import './assets/style/index.scss';
</style>
