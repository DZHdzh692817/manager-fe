<template>
    <div class="role-manage">
        <div class="query-form">
            <el-form ref="form" :inline="true" :model="queryForm">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="queryForm.roleName" placeholder="请输入菜单名称"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleQuery">查询</el-button>
                    <el-button @click="handleReset('form')">重置 </el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="base-table">
            <div class="action"><el-button type="primary" @click="handleAdd">创建</el-button></div>
            <el-table :data="roleList">
                <el-table-column v-for="item in columns"
                    :key="item.prop"
                    :prop="item.prop"
                    :label="item.label"
                    :width="item.width"
                    :formatter="item.formatter"
                >
                </el-table-column>
                <el-table-column label="操作" width="280">
                    <template #default="scope">
                        <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="mini" @click="handleOpenPermision(scope.row)">设置权限</el-button>
                        <el-button type="danger" size="mini" @click="handleDel(scope.row._id)" >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pagination" background layout="prev, pager, next" :total="pager.total" :page-size="pager.pageSize"
                @current-change="handleCurrentChange"
            />
        </div>
    </div>

    <el-dialog title="角色新增" v-model="showModal">
      <el-form ref="dialogForm" :model="roleForm" label-width="100px" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="2" v-model="roleForm.remark" placeholder="请输入备注"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 权限弹框 -->
    <el-dialog title="权限设置" v-model="showPermission">
        <el-form label-width="100px">
            <el-form-item label="角色名称">{{ curRoleName }}</el-form-item>
            <el-form-item label="选择权限">
                <el-tree
                    ref="tree"
                    :data="menuList"
                    show-checkbox
                    node-key="_id"
                    default-expand-all
                    :props="{label:'menuName'}"
                />
            </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPermission = false">取 消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>    
</template>

<script>
import utils from './../utils/utils'
export default {
    name: 'Role',
    data() {
        return {
            pager: {
                pageNum: 1,
                total: 0,
                pageSize: 10
            },
            queryForm: {
                roleName: '',
            },
            roleList: [],
            columns: [
                {
                    label:'角色名称',
                    prop:'roleName',
                    width:180, 
                },
                {
                    label:'备注',
                    prop:'remark',
                    width:180, 
                },
                {
                    label:'权限列表',
                    prop:'permissionList',
                    formatter: (row, column, value) => {
                        let names = [];
                        let list = value.checkedKeys || [];
                        list.map((key) => {
                            let name = this.actionMap[key];
                            if (key && name) names.push(name);
                        });
                        return names.join(",");
                    },
                },
                {
                    label:'创建时间',
                    prop:'createTime',
                    width:180,
                    formatter(row, column, value) {
                        return utils.formateDate(new Date(value))
                    }
                },
                {
                    label:'更新时间',
                    prop:'updateTime',
                    width:180,
                    formatter(row, column, value) {
                        return utils.formateDate(new Date(value))
                    }
                },
            ],
            showModal: false,
            roleForm:{
                roleName: '',
                remark: ''
            },
            rules:{
                roleName: [{required: true,message: "请输入角色名称",trigger: "blur",}]
            },
            action: 'create',
            showPermission: false,
            curRoleName: '',
            curRoleId: 0,
            menuList: [],
            //菜单映射表
            actionMap:{}
        }
    },
    mounted() {
        this.getRoleList();
        this.getMenuList();
    },
    methods:{
        //角色列表初始化
        async getRoleList() {
            try {
                let {list, page} = await this.$api.getRoleList({
                    ...this.queryForm, 
                    ...this.pager
                });
                this.roleList = list;
                this.pager.total = page.total;
            } catch (error) {
                throw new Error(error)
            }
        },
        //菜单列表初始化
        async getMenuList() {
            try {
                let list = await this.$api.getMenuList();
                this.menuList = list;
                this.getActionMap(list)
            } catch (error) {
                throw new Error(error)
            }
           
        },
        handleQuery() {
            this.getRoleList()
        },
        handleReset(form) {
            this.$refs[form].resetFields();
        },
        async handleDel(_id) {
            await this.$api.roleOperate({
                _id,
                action:'delete'
            })
            this.$message.success('删除成功');
            this.getRoleList();
        },
        handleCurrentChange(current) {
            //current点击的页数
            this.pager.pageNum = current;
            this.getRoleList;
        },
        handleAdd() {
            this.action = 'create';
            this.showModal = true;
        },
        //编辑
        handleEdit(row) {
            this.action = 'edit';
            this.showModal = true;
            this.$nextTick(()=>{
                //Object.assign(this.roleForm, row);//assign浅拷贝
                this.roleForm = {
                    _id: row._id,
                    roleName: row.roleName,
                    remark: row.remark
                }
            })
        },
        //弹框关闭
        handleClose() {
            this.showModal = false;
            this.handleReset('dialogForm');
        },
        //角色新增 编辑
        handleSubmit() {
            this.$refs.dialogForm.validate( async (valid)=>{
                if(valid) {
                    // let { roleForm, action } = this;
                    // let params = {...roleForm, action}
                    // this.$api.roleOperate(params)
                    let res = await this.$api.roleOperate({
                        roleForm: this.roleForm,
                        action: this.action
                    })
                    if(res) {
                        this.showModal = false;
                        this.$message.success('创建成功')
                        this.handleReset('dialogForm');
                        this.getRoleList()
                    }
                }
            })
        },
        //1.打开弹框
        handleOpenPermision(row) {
            this.curRoleId = row._id;
            this.curRoleName = row.roleName;
            this.showPermission = true;
            //2.解构初始化赋值
            let { checkedKeys } = row.permissionList;
            setTimeout(() => {
                this.$refs.tree.setCheckedKeys(checkedKeys);
            });
        },
        //3.选中权限后提交
        async handlePermissionSubmit() {
            let nodes = this.$refs.tree.getCheckedNodes();
            let halfKeys = this.$refs.tree.getHalfCheckedKeys();
            let checkedKeys = [];
            let parentKeys = [];
            nodes.map(node => {
                if(node.children) {
                    checkedKeys.push(node._id);//选中的按钮
                } else {
                    parentKeys.push(node._id);//选中的菜单
                }
            })

            let params = {
                _id: this.curRoleId,
                permissionList: {
                    checkedKeys,
                    halfCheckedKeys: parentKeys.concat(halfKeys),
                },
            };
            await this.$api.updatePermission(params);
            this.showPermission = false;
            this.$message.success("设置成功");
            this.getRoleList();
        },
        //
        getActionMap(list) {
            let actionMap = {};
            const deep = (arr) => {
                while (arr.length) {
                    let item = arr.pop();
                    if (item.children && item.action) {
                        actionMap[item._id] = item.menuName;
                    }
                    if (item.children && !item.action) {
                        deep(item.children);
                    }
                }
            };
            deep(JSON.parse(JSON.stringify(list)));
            this.actionMap = actionMap;
            //console.log('-------')
            //console.log(this.actionMap);
        },
    }
    
}
</script>

<style lang="scss">

</style>