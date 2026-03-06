<template>
  <div class="permission-manage">
    <a-card title="权限管理">
      <template #extra>
        <a-button type="primary" @click="showAddModal">
          <template #icon><PlusOutlined /></template>
          新增权限
        </a-button>
      </template>

      <!-- 权限树表格 -->
      <a-table
        :columns="columns"
        :data-source="permissionList"
        :loading="loading"
        row-key="id"
        default-expand-all-rows
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'type'">
            <a-tag :color="typeColors[record.type]">
              {{ typeTexts[record.type] }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="record.status === 1 ? 'green' : 'red'">
              {{ record.status === 1 ? '正常' : '已删除' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="showEditModal(record)">编辑</a-button>
              <a-popconfirm
                title="确定删除该权限吗？"
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
      :title="formState.id ? '编辑权限' : '新增权限'"
      @ok="handleSubmit"
      :confirm-loading="submitLoading"
    >
      <a-form :model="formState" :rules="rules" layout="vertical" ref="formRef">
        <a-form-item label="权限标识" name="permissionSign">
          <a-input v-model:value="formState.permissionSign" placeholder="如：system:user:add" />
        </a-form-item>
        <a-form-item label="权限名称" name="name">
          <a-input v-model:value="formState.name" placeholder="请输入权限名称" />
        </a-form-item>
        <a-form-item label="权限描述" name="description">
          <a-input v-model:value="formState.description" placeholder="请输入权限描述" />
        </a-form-item>
        <a-form-item label="访问路径" name="url">
          <a-input v-model:value="formState.url" placeholder="请输入访问路径" />
        </a-form-item>
        <a-form-item label="父级权限" name="parentId">
          <a-tree-select
            v-model:value="formState.parentId"
            :tree-data="permissionTree"
            :field-names="{ label: 'name', value: 'id', children: 'children' }"
            placeholder="请选择父级权限"
            allow-clear
            tree-default-expand-all
          />
        </a-form-item>
        <a-form-item label="类型" name="type">
          <a-radio-group v-model:value="formState.type">
            <a-radio :value="0">目录</a-radio>
            <a-radio :value="1">菜单</a-radio>
            <a-radio :value="2">按钮</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="排序" name="orderNum">
          <a-input-number v-model:value="formState.orderNum" :min="0" />
        </a-form-item>
        <a-form-item label="图标" name="icon">
          <a-input v-model:value="formState.icon" placeholder="请输入图标名称" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { getAllPermissions, addPermission, updatePermission, deletePermission } from '@/api/permission'
import type { Permission } from '@/types'

const loading = ref(false)
const permissionList = ref<Permission[]>([])

const typeColors: Record<number, string> = {
  0: 'blue',
  1: 'green',
  2: 'orange'
}

const typeTexts: Record<number, string> = {
  0: '目录',
  1: '菜单',
  2: '按钮'
}

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '权限名称', dataIndex: 'name', key: 'name', width: 150 },
  { title: '权限标识', dataIndex: 'permissionSign', key: 'permissionSign', width: 180 },
  { title: '类型', dataIndex: 'type', key: 'type', width: 80 },
  { title: '路径', dataIndex: 'url', key: 'url', width: 150 },
  { title: '排序', dataIndex: 'orderNum', key: 'orderNum', width: 80 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '操作', key: 'action', width: 150 }
]

// 获取权限列表
const fetchPermissionList = async () => {
  loading.value = true
  try {
    permissionList.value = await getAllPermissions()
  } finally {
    loading.value = false
  }
}

// 权限树数据（用于选择父级）
const permissionTree = computed(() => {
  const rootNodes: Permission[] = [{ id: 0, name: '顶级目录', children: permissionList.value } as any]
  return rootNodes
})

// 新增/编辑表单
const formVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref()
const formState = reactive({
  id: undefined as number | undefined,
  permissionSign: '',
  name: '',
  description: '',
  url: '',
  parentId: 0,
  type: 1,
  orderNum: 0,
  icon: ''
})

const rules = {
  permissionSign: [{ required: true, message: '请输入权限标识', trigger: 'blur' }],
  name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
  parentId: [{ required: true, message: '请选择父级权限', trigger: 'change' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }]
}

const showAddModal = () => {
  formState.id = undefined
  formState.permissionSign = ''
  formState.name = ''
  formState.description = ''
  formState.url = ''
  formState.parentId = 0
  formState.type = 1
  formState.orderNum = 0
  formState.icon = ''
  formVisible.value = true
}

const showEditModal = (record: Permission) => {
  formState.id = record.id
  formState.permissionSign = record.permissionSign
  formState.name = record.name
  formState.description = record.description || ''
  formState.url = record.url || ''
  formState.parentId = record.parentId || 0
  formState.type = record.type
  formState.orderNum = record.orderNum || 0
  formState.icon = record.icon || ''
  formVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    submitLoading.value = true
    if (formState.id) {
      await updatePermission({
        id: formState.id,
        permissionSign: formState.permissionSign,
        name: formState.name,
        description: formState.description,
        url: formState.url,
        parentId: formState.parentId,
        type: formState.type,
        orderNum: formState.orderNum,
        icon: formState.icon
      })
      message.success('更新成功')
    } else {
      await addPermission({
        permissionSign: formState.permissionSign,
        name: formState.name,
        description: formState.description,
        url: formState.url,
        parentId: formState.parentId,
        type: formState.type,
        orderNum: formState.orderNum,
        icon: formState.icon
      })
      message.success('新增成功')
    }
    formVisible.value = false
    fetchPermissionList()
  } catch (e) {
    // ignore
  } finally {
    submitLoading.value = false
  }
}

// 删除权限
const handleDelete = async (record: Permission) => {
  await deletePermission({ id: record.id })
  message.success('删除成功')
  fetchPermissionList()
}

onMounted(() => {
  fetchPermissionList()
})
</script>

<style scoped lang="less">
.permission-manage {
  :deep(.ant-table) {
    margin-top: 16px;
  }
}
</style>