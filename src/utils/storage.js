/**
* Storage 二次封装 
* @author dzh 2021-11-9
*/
import config from './../config'
export default {
    setItem(key,val){
        let storage = this.getStorage();
        storage[key] = val;
        window.localStorage.setItem(config.namespace, JSON.stringify(storage));
    },
    getItem(key){
        return this.getStorage()[key]
    },
    getStorage() {
        return JSON.parse(window.localStorage.getItem(config.namespace) || "{}");
    },
    //删除某一项
    clearItem(key){
        let storage = this.getStorage();
        delete storage[key]
        window.localStorage.setItem(config.namespace, JSON.stringify(storage));
    },
    clearAll(){
        window.localStorage.clear()
    }
}
