/**
 * api管理
*/
import request from './../utils/request'
export default {
    //用户登录
    login(params) {
        return request({
            url: '/users/login',
            method: 'post',
            data: params,
        })
    },
    //通知数量
    noticeCount() {
        return request({
            url: '/leave/count',
            method: 'get',
            data: {},
            mock: true
        })
    },
    //获取左侧菜单栏列表
    getMenuList(params) {
        return request({
            url: '/menu/list',
            method: 'get',
            data: params,
            mock: false
        })
    },
    //获取用户列表
    getUserList(params) {
        return request({
            url: '/users/list',
            method: 'get',
            data: params,
            mock: false
        })
    },
    //删除一个用户
    userDel(params) {
        return request({
            url: '/users/delete',
            method: 'post',
            data: params,
            mock: false
        })
    },
    //获取角色列表
    getRoleAllList() {
        return request({
            url: '/roles/allList',
            method: 'get',
            data: {},
            mock: false
        })
    },
    getRoleList(params) {
        return request({
            url: '/roles/List',
            method: 'get',
            data: params,
            mock: false
        })
    },
    //获取部门列表
    getDeptList() {
        return request({
            url: '/dept/list',
            method: 'get',
            data: {},
            mock: true
        })
    },
    //新增/编辑用户
    userSubmit(params) {
        return request({
            url: '/users/operate',
            method: 'post',
            data: {params},
            mock: false
        })
    },
    //菜单新增/编辑/删除
    menuSubmit(params) {
        return request({
            url: '/menu/operate',
            method: 'post',
            data: params,
            mock: false
        })
    },
    //角色新增 编辑 删除
    roleOperate(params) {
        return request({
            url: '/roles/operate',
            method: 'post',
            data: params,
            mock: false
        })
    },
    updatePermission(params) {
        return request({
            url: '/roles/update/permission',
            method: 'post',
            data: params,
            mock: false
        })
    }
}
