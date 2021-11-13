import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
//https://element-plus.gitee.io/zh-CN/guide/quickstart.html#完整引入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

//全局挂载
import request from './utils/request'
import storage from './utils/storage'

//import axios from 'axios'
//import config from './config'

//console.log("环境变量=>",import.meta.env)
const app = createApp(App);
app.config.globalProperties.$request = request;
app.config.globalProperties.$storage = storage;
// axios.get(config.mockApi + '/login').then((res)=>{
//     console.log(res)
// })
app.use(router).use(ElementPlus).mount('#app');
