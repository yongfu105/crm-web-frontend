<template>
  <div class="dashboard">
    <a-row :gutter="16">
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="用户总数"
            :value="statistics.userCount"
            :value-style="{ color: '#3f8600' }"
          >
            <template #prefix><UserOutlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="角色总数"
            :value="statistics.roleCount"
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix><TeamOutlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="权限总数"
            :value="statistics.permissionCount"
            :value-style="{ color: '#722ed1' }"
          >
            <template #prefix><LockOutlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="今日访问"
            :value="statistics.todayVisit"
            :value-style="{ color: '#cf1322' }"
          >
            <template #prefix><EyeOutlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <a-card title="欢迎使用" style="margin-top: 16px">
      <a-descriptions :column="2">
        <a-descriptions-item label="系统名称">CRM管理系统</a-descriptions-item>
        <a-descriptions-item label="系统版本">V1.0.0</a-descriptions-item>
        <a-descriptions-item label="当前用户">{{ userStore.realName || userStore.username }}</a-descriptions-item>
        <a-descriptions-item label="用户角色">{{ roleText }}</a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { UserOutlined, TeamOutlined, LockOutlined, EyeOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const statistics = reactive({
  userCount: 0,
  roleCount: 0,
  permissionCount: 0,
  todayVisit: 0
})

const roleText = computed(() => {
  const roleId = userStore.userInfo?.roleId
  if (roleId === 1) return '超级管理员'
  if (roleId === 2) return '普通用户'
  return '未知角色'
})
</script>

<style scoped lang="less">
.dashboard {
  :deep(.ant-card) {
    border-radius: 8px;
  }
}
</style>