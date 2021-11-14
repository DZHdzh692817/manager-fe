/**
 * Mutations业务层数据提交
*/
import storage from './../utils/storage'
export default {
    //保存用户信息
    saveUserInfo(state, userInfo) {
        state.userInfo = userInfo;
        storage.setItem('userInfo', userInfo)
    }
}
