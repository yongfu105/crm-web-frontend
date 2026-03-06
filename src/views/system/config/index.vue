<template>
  <div class="config-manage">
    <a-card title="系统配置">
      <template #extra>
        <a-button type="primary" @click="showAddModal">
          <template #icon><PlusOutlined /></template>
          新增配置
        </a-button>
      </template>

      <!-- 表格 -->
      <a-table
        :columns="columns"
        :data-source="configList"
        :loading="loading"
        row-key="configKey"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="showEditModal(record)">编辑</a-button>
              <a-popconfirm
                title="确定删除该配置吗？"
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
      :title="formState.configKey ? '编辑配置' : '新增配置'"
      @ok="handleSubmit"
      :confirm-loading="submitLoading"
    >
      <a-form :model="formState" layout="vertical" ref="formRef">
        <a-form-item label="配置键" name="configKey">
          <a-input
            v-model:value="formState.configKey"
            placeholder="请输入配置键"
            :disabled="!!editMode"
          />
        </a-form-item>
        <a-form-item label="配置值" name="configValue">
          <a-textarea v-model:value="formState.configValue" placeholder="请输入配置值" :rows="4" />
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-input v-model:value="formState.description" placeholder="请输入描述" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { getAllConfigs, updateConfig, deleteConfig } from '@/api/config'
import type { SysConfig } from '@/types'

const loading = ref(false)
const configList = ref<SysConfig[]>([])

const columns = [
  { title: '配置键', dataIndex: 'configKey', key: 'configKey', width: 200 },
  { title: '配置值', dataIndex: 'configValue', key: 'configValue' },
  { title: '描述', dataIndex: 'description', key: 'description', width: 200 },
  { title: '操作', key: 'action', width: 150 }
]

// 获取配置列表
const fetchConfigList = async () => {
  loading.value = true
  try {
    configList.value = await getAllConfigs()
  } finally {
    loading.value = false
  }
}

// 新增/编辑表单
const formVisible = ref(false)
const editMode = ref(false)
const submitLoading = ref(false)
const formRef = ref()
const formState = reactive({
  configKey: '',
  configValue: '',
  description: ''
})

const showAddModal = () => {
  editMode.value = false
  formState.configKey = ''
  formState.configValue = ''
  formState.description = ''
  formVisible.value = true
}

const showEditModal = (record: SysConfig) => {
  editMode.value = true
  formState.configKey = record.configKey
  formState.configValue = record.configValue || ''
  formState.description = record.description || ''
  formVisible.value = true
}

const handleSubmit = async () => {
  submitLoading.value = true
  try {
    await updateConfig({
      configKey: formState.configKey,
      configValue: formState.configValue,
      description: formState.description
    })
    message.success('保存成功')
    formVisible.value = false
    fetchConfigList()
  } finally {
    submitLoading.value = false
  }
}

// 删除配置
const handleDelete = async (record: SysConfig) => {
  await deleteConfig(record.configKey)
  message.success('删除成功')
  fetchConfigList()
}

onMounted(() => {
  fetchConfigList()
})
</script>

<style scoped lang="less">
.config-manage {
  :deep(.ant-table) {
    margin-top: 16px;
  }
}
</style>