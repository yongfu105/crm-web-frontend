<template>
  <div class="role-manage">
    <a-card title="角色管理">
      <template #extra>
        <a-button type="primary" @click="showAddModal">
          <template #icon><PlusOutlined /></template>
          新增角色
        </a-button>
      </template>

      <!-- 搜索区域 -->
      <a-form layout="inline" style="margin-bottom: 16px">
        <a-form-item label="角色名称">
          <a-input v-model:value="searchForm.name" placeholder="请输入角色名称" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="fetchRoleList">查询</a-button>
        </a-form-item>
      </a-form>

      <!-- 表格 -->
      <a-table
        :columns="columns"
        :data-source="roleList"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 1 ? 'green' : 'red'">
              {{ record.status === 1 ? '正常' : '已禁用' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="showEditModal(record)">编辑</a-button>
              <a-button type="link" size="small" @click="showPermModal(record)">分配权限</a-button>
              <a-button
                type="link"
                size="small"
                @click="handleToggleStatus(record)"
              >
                {{ record.status === 1 ? '禁用' : '启用' }}
              </a-button>
              <a-popconfirm
                title="确定删除该角色吗？"
                @confirm="handleDelete(record)"
              >
                <a-button type="link" size="small" danger>删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 新增/编辑弹窗 -->
    <a-modal
      v-model:open="formVisible"
      :title="formState.id ? '编辑角色' : '新增角色'"
      @ok="handleSubmit"
      :confirm-loading="submitLoading"
    >
      <a-form :model="formState" :rules="rules" layout="vertical" ref="formRef">
        <a-form-item label="角色名称" name="name">
          <a-input v-model:value="formState.name" placeholder="请输入角色名称" />
        </a-form-item>
        <a-form-item label="角色标识" name="roleSign">
          <a-input v-model:value="formState.roleSign" placeholder="请输入角色标识" />
        </a-form-item>
        <a-form-item label="角色描述" name="description">
          <a-textarea v-model:value="formState.description" placeholder="请输入角色描述" />
        </a-form-item>
        <a-form-item label="是否系统内置" name="isSystem">
          <a-radio-group v-model:value="formState.isSystem">
            <a-radio :value="0">否</a-radio>
            <a-radio :value="1">是</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 分配权限弹窗 -->
    <a-modal
      v-model:open="permVisible"
      title="分配权限"
      @ok="handleAssignPerm"
      :confirm-loading="permLoading"
      width="600px"
    >
      <a-tree
        v-model:checkedKeys="checkedPermKeys"
        :tree-data="permTreeData"
        checkable
        :field-names="{ title: 'name', key: 'id', children: 'children' }"
        :selectable="false"
        default-expand-all
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import {
  getRolePage,
  addRole,
  updateRole,
  deleteRole,
  updateRoleStatus,
  updateRolePerms,
  getRolePerms
} from '@/api/role'
import { getAllPermissions } from '@/api/permission'
import type { Role, Permission } from '@/types'

const loading = ref(false)
const roleList = ref<Role[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  onChange: (page: number, pageSize: number) => {
    pagination.current = page
    pagination.pageSize = pageSize
    fetchRoleList()
  }
})

const searchForm = reactive({
  name: ''
})

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '角色名称', dataIndex: 'name', key: 'name' },
  { title: '角色标识', dataIndex: 'roleSign', key: 'roleSign' },
  { title: '描述', dataIndex: 'description', key: 'description' },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '操作', key: 'action', width: 280 }
]

// 获取角色列表
const fetchRoleList = async () => {
  loading.value = true
  try {
    const res = await getRolePage({
      current: pagination.current,
      size: pagination.pageSize
    })
    roleList.value = res.records
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

// 新增/编辑表单
const formVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref()
const formState = reactive({
  id: undefined as number | undefined,
  name: '',
  roleSign: '',
  description: '',
  isSystem: 0
})

const rules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  roleSign: [{ required: true, message: '请输入角色标识', trigger: 'blur' }],
  description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
  isSystem: [{ required: true, message: '请选择是否系统内置', trigger: 'change' }]
}

const showAddModal = () => {
  formState.id = undefined
  formState.name = ''
  formState.roleSign = ''
  formState.description = ''
  formState.isSystem = 0
  formVisible.value = true
}

const showEditModal = (record: Role) => {
  formState.id = record.id
  formState.name = record.name
  formState.roleSign = record.roleSign
  formState.description = record.description || ''
  formState.isSystem = 0
  formVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    submitLoading.value = true
    if (formState.id) {
      await updateRole({
        id: formState.id,
        name: formState.name,
        roleSign: formState.roleSign,
        description: formState.description,
        isSystem: formState.isSystem
      })
      message.success('更新成功')
    } else {
      await addRole({
        name: formState.name,
        roleSign: formState.roleSign,
        description: formState.description,
        isSystem: formState.isSystem
      })
      message.success('新增成功')
    }
    formVisible.value = false
    fetchRoleList()
  } catch (e) {
    // ignore
  } finally {
    submitLoading.value = false
  }
}

// 删除角色
const handleDelete = async (record: Role) => {
  await deleteRole({ id: record.id })
  message.success('删除成功')
  fetchRoleList()
}

// 切换状态
const handleToggleStatus = async (record: Role) => {
  await updateRoleStatus({
    id: record.id,
    status: record.status === 1 ? 0 : 1
  })
  message.success('操作成功')
  fetchRoleList()
}

// 分配权限
const permVisible = ref(false)
const permLoading = ref(false)
const currentRoleId = ref<number>()
const checkedPermKeys = ref<number[]>([])
const permTreeData = ref<Permission[]>([])

const showPermModal = async (record: Role) => {
  currentRoleId.value = record.id
  // 获取所有权限
  const perms = await getAllPermissions()
  permTreeData.value = perms
  // 获取当前角色的权限
  const rolePerms = await getRolePerms({ roleId: record.id })
  checkedPermKeys.value = rolePerms.map((p: Permission) => p.id)
  permVisible.value = true
}

const handleAssignPerm = async () => {
  if (!currentRoleId.value) return
  permLoading.value = true
  try {
    await updateRolePerms({
      id: currentRoleId.value,
      permIds: checkedPermKeys.value as number[]
    })
    message.success('分配成功')
    permVisible.value = false
  } finally {
    permLoading.value = false
  }
}

onMounted(() => {
  fetchRoleList()
})
</script>

<style scoped lang="less">
.role-manage {
  :deep(.ant-table) {
    margin-top: 16px;
  }
}
</style>