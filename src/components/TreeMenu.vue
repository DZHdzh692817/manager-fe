<template>
    <template v-for="(menu, index) in userMenu" :key="index">
        <el-sub-menu v-if="menu.children && menu.children.length > 0 && menu.children[0].menuType == 1" :index="menu.path">
            <template #title>
                <!-- <el-icon><icon-menu /></el-icon> -->
                <!-- <i :class="menu.icon"></i> -->
                <span>{{menu.menuName}}</span>
            </template>
            <tree-menu :userMenu="menu.children" />
        </el-sub-menu>
        <el-menu-item v-else-if="menu.menuType == 1" :index="menu.path" :key="menu._id">
            {{menu.menuName}}
        </el-menu-item>
    </template>
    <!-- <el-sub-menu index="1">
        <template #title>
            <el-icon><icon-menu /></el-icon>
            <span>系统管理</span>
        </template>
        <el-menu-item index="1-1">用户管理</el-menu-item>
        <el-menu-item index="1-2">菜单管理</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
        <template #title>
            <el-icon><icon-menu /></el-icon>
            <span>审批管理</span>
        </template>
        <el-menu-item index="2-1">休假申请</el-menu-item>
        <el-menu-item index="2-2">待我审批</el-menu-item>
    </el-sub-menu> -->
</template>

<script>
import { Menu as IconMenu} from '@element-plus/icons'
export default{
    name: 'TreeMenu',
    components: { IconMenu },
    props:{
        userMenu:{
           type:Array,
           default(){
               return []
           } 
        }
    }
}
</script>
