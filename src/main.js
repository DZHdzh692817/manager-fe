import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import api from './api'
import store from './store'

//全局挂载
import request from './utils/request'
import storage from './utils/storage'

//console.log("环境变量=>",import.meta.env)
const app = createApp(App);
app.config.globalProperties.$request = request;
app.config.globalProperties.$storage = storage;
app.config.globalProperties.$api = api;
app.use(router).use(store).use(ElementPlus, { size: 'small' }).mount('#app');
