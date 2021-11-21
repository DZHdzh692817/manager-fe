<template>
    <div class="user-manage">
        <div class="query-form">
            <el-form ref="form" :inline="true" :model="user">
                <el-form-item prop="userId">
                    <el-input v-model="userId" placeholder="请输入用户ID"/>
                </el-form-item>
                <el-form-item prop="userName">
                    <el-input v-model="userName" placeholder="请输入用户名称"/>
                </el-form-item>
                <el-form-item prop="state">
                    <el-select v-model="state" placeholder="状态">
                        <el-option :value="0" label="所有"></el-option>
                        <el-option :value="1" label="在职"></el-option>
                        <el-option :value="2" label="离职"></el-option>
                        <el-option :value="3" label="试用期"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleQuery">查询</el-button>
                    <el-button @click="handleReset('form')">重置 </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="base-table">
            <div class="action">
                <el-button type="primary" @click="handleCreate">新增</el-button>
                <el-button type="danger" @click="handlePatchDel">批量删除</el-button>
            </div>
            <el-table :data="userList" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"/>
                <el-table-column 
                    v-for="(item, index) in columns" 
                    :key="index" 
                    :prop="item.prop" 
                    :label="item.label" 
                    :width="item.width" 
                    :formatter="item.formatter"
                />
                <el-table-column label="操作" width="150">
                    <template #default="scope">
                        <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="danger" size="mini" @click="handleDel(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pagination" background layout="prev, pager, next" :total="total" :page-size="pageSize"
                @current-change="handleCurrentChange"
            />
        </div>

        <el-dialog v-model="showModel" title="用户新增">
            <el-form ref="dialogForm" :model="userForm" :rules="rules" label-width="100px">
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="userForm.userName" placeholder="请输入用户名称" :disabled="action == 'edit'"/>
                </el-form-item>
                <el-form-item label="邮箱" prop="userEmail">
                    <el-input v-model="userForm.userEmail" placeholder="请输入用户邮箱" :disabled="action == 'edit'">
                        <template #append>@qq.com</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="userForm.mobile" placeholder="请输入用户手机号"/>
                </el-form-item>
                <el-form-item label="岗位" prop="job">
                    <el-input v-model="userForm.job" placeholder="请输入用户岗位"/>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="userForm.state">
                        <el-option :value="1" label="在职"></el-option>
                        <el-option :value="2" label="离职"></el-option>
                        <el-option :value="3" label="试用期"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="系统角色" prop="roleList">
                    <el-select v-model="userForm.roleList" placeholder="请选择用户系统角色" multiple style="width:100%;">
                        <el-option v-for="(role, index) in roleList" :key="index" :label="role.roleName" :value="role._id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部门" prop="deptId">
                    <el-cascader placeholder="请选择所属部门" :show-all-levels="true" style="width:100%;"
                    v-model="userForm.deptId" 
                    :options="deptList" 
                    :props="{ checkStrictly: true, value: '_id', label:'deptName' }" 
                    clearable
                />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { onMounted, reactive, ref, toRefs, getCurrentInstance, toRaw } from 'vue'
import utils from './../utils/utils'
export default{
    name: 'User',
    setup() {
        //   获取Composition API 上下文对象
        const { proxy } = getCurrentInstance();// 使用proxy代替ctx，因为ctx只在开发环境有效
        // 初始化用户表单对象
        const user = reactive({
            state: 1,
            userId: '',
            userName: ''//不用写这两个下面...user还能解构了？
        });
        // 初始化用户列表数据
        const userList = ref([]);
         // 初始化分页对象
        const pager = reactive({
            pageNum: 1,
            pageSize: 10,
            total: 0
        });
        //选中用户列表对象
        const checkedUserIds = ref([]);
        //弹框显示对象
        const showModel = ref(false);
        //新增用户Form对象
        const userForm = reactive({
            state: 3
        })
        //定义表单校验规则
        const rules = reactive({
            userName: [{required:true, message:'请输入用户名称',trigger:'blur'}],
            userEmail: [{required:true, message:'请输入用户邮箱',trigger:'blur'}],
            mobile: [{required:true, message:'请输入手机号',trigger:'blur'}],
            deptId: [{required:true, message:'请选择部门',trigger:'blur'}],
        })
        // 所有角色列表
        const roleList = ref([])//使用reactive([])无效
        // 所有部门列表
        const deptList = ref([]);
        //定义用户操作行为
        const action = ref('create');
        // 定义动态表格-格式
        const columns = reactive([
            {label: 'ID',prop: 'userId'},
            {label: '名称',prop: 'userName'},
            {label: '邮箱',prop: 'userEmail'},
            {
                label: '角色',
                prop: 'role',
                formatter(row,column,value){
                    return {
                        0: '管理员',
                        1: '普通用户'
                    }[value]
                }
            },
            {
                label: '状态',
                prop: 'state',
                formatter(row,column,value){
                    return {
                        1: '在职',
                        2: '离职',
                        3: '试用期'
                    }[value]
                }
            },
            {
                label: '注册时间',
                prop: 'createTime',
                'width':180,
                formatter(row, column, value) {
                    return utils.formateDate(new Date(value))
                }
            },
            {
                label: '最后登录时间',
                prop: 'lastLoginTime',
                'width':180,
                formatter(row, column, value) {
                    return utils.formateDate(new Date(value))
                }
            },
        ]);
        // 初始化接口调用
        onMounted(()=>{
            getUserList();
            getDeptList();
            getRoleList();
        });
         // 获取用户列表
        const getUserList = async () => {
            //let params = { ...pager, ...user};//let params = { ...user, ...pager };这个不行
            let params = {
                state: user.state,
                userId: user.userId,
                userName: user.userName,
                pageNum: pager.pageNum,
                pageSize: pager.pageSize,
            }
            try {
                const { list, page } = await proxy.$api.getUserList(params)
                userList.value = list;
                pager.total = page.total;
            } catch (error) {}
        };
        //  查询事件，获取用户列表
        const handleQuery = () => {
            getUserList();
        };
        // 重置查询表单
        const handleReset = (form) => {
            proxy.$refs[form].resetFields();
        };
        // 分页事件处理
        const handleCurrentChange = (current) => {
            //current点击的页数
            pager.pageNum = current;
            getUserList();
        };
        //用户单个删除
        const handleDel = async (row) => {
            try {
                await proxy.$api.userDel({
                    userIds: [row.userId]
                })
                proxy.$message.success('删除成功')
                getUserList();
            } catch (error) {}
        }
        //表格多选
        const handleSelectionChange = (list) => {
            //checkedUserIds
            let arr = [];
            list.map(item => {
                arr.push(item.userId)
            })
            checkedUserIds.value = arr;
        }
        //批量删除
        const handlePatchDel = async () => {
            if(checkedUserIds.value.length == 0) {
                proxy.$message.error('请选中要删除的用户')
                return ;
            }
            try {
                const res = await proxy.$api.userDel({
                    userIds: checkedUserIds.value
                })
                if(res.matchedCount > 0) {
                    proxy.$message.success('删除成功')
                    getUserList();
                } else {
                    proxy.$message.error('删除失败')
                }
            } catch (error) {}
        }
        //用户新增
        const handleCreate = () => {
            action.value = 'add';
            showModel.value = true;
        }
        //获取部门列表
        const getDeptList = async () => {
            let list = await proxy.$api.getDeptList()
            deptList.value = list
        }
        //获取角色列表
        const getRoleList = async () => {
            let list = await proxy.$api.getRoleList()
            roleList.value = list
        }
        
        //用户弹框取消
        const handleClose = () => {
            showModel.value = false;
            handleReset('dialogForm');
        }
        //用户弹框提交
        const handleSubmit = () => {
            proxy.$refs.dialogForm.validate(async (valid)=>{
                if(valid) {
                    let params = toRaw(userForm);//转换成普通对象
                    params.userEmail += '@qq.com';
                    params.action = action.value;
                    let res = await proxy.$api.userSubmit(params);//提交到后端
                    // if(res) {
                        
                    // }
                    showModel.value = false;
                    proxy.$message.success('用户创建成功')
                    handleReset('dialogForm');
                    getUserList();
                }
            })
        }
        //用户编辑
        const handleEdit = (row) => {
            action.value = 'edit';
            showModel.value = true;
            proxy.$nextTick(() => {
                Object.assign(userForm, row);
            })
        }

        const { pageNum, pageSize, total } = toRefs(pager);
        const { userId, userName, state } = toRefs(user);
       
        return {
            action,
            rules,
            userForm,
            showModel,
            checkedUserIds,
            userList,
            columns,
            getUserList,
            handleQuery,
            handleReset,
            handleCurrentChange,
            handleDel,
            handlePatchDel,
            handleSelectionChange,
            handleCreate,
            getDeptList,
            getRoleList,
            handleClose,
            handleSubmit,
            handleEdit,

            roleList,
            deptList,

            pageNum,
            total,
            pageSize,
            user,
            userId, 
            userName,
            state
        }
    }
}
</script>

<style lang="scss">

</style>
