/**
 * 环境配置封装
 */
const env = import.meta.env.MODE || 'prod'//默认生产环境
const EnvConfig = {
    //开发环境
    dev:{
        baseApi:'/',
        mockApi:'https://www.fastmock.site/mock/34ddf2567f7741ae154d77373eed4ed9/api'
    },
    //测试环境
    test:{
        baseApi:'//test.futurefe.com/api',
        mockApi:'https://www.fastmock.site/mock/34ddf2567f7741ae154d77373eed4ed9/api'
    },
    //生产环境
    prod:{
        baseApi:'//futurefe.com/api',
        mockApi:'https://www.fastmock.site/mock/34ddf2567f7741ae154d77373eed4ed9/api'
    }
}
export default {
    env,
    mock:true,
    namespace:'manger',//定义一个命名空间 用来对应localStorage
    ...EnvConfig[env]
    //baseApi:'www.baidu.com/api', // test-www.baidu.com/api 
    
}