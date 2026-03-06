<template>
  <div class="user-manage">
    <a-card title="用户管理">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="showResetPasswordModal">
            <template #icon><KeyOutlined /></template>
            重置密码
          </a-button>
          <a-button type="primary" @click="showChangeRoleModal">
            <template #icon><TeamOutlined /></template>
            更改角色
          </a-button>
        </a-space>
      </template>

      <a-descriptions :column="2" bordered>
        <a-descriptions-item label="用户ID">{{ userInfo.id }}</a-descriptions-item>
        <a-descriptions-item label="用户名">{{ userInfo.username }}</a-descriptions-item>
        <a-descriptions-item label="真实姓名">{{ userInfo.realName || '-' }}</a-descriptions-item>
        <a-descriptions-item label="用户类型">{{ userTypeText }}</a-descriptions-item>
        <a-descriptions-item label="邮箱">{{ userInfo.email || '-' }}</a-descriptions-item>
        <a-descriptions-item label="手机号">{{ userInfo.phone || '-' }}</a-descriptions-item>
        <a-descriptions-item label="性别">{{ sexText }}</a-descriptions-item>
        <a-descriptions-item label="年龄">{{ userInfo.age || '-' }}</a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag :color="userInfo.status === 1 ? 'green' : 'red'">
            {{ userInfo.status === 1 ? '正常' : '已删除' }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="最后登录">
          {{ userInfo.lastLoginTime || '-' }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <!-- 重置密码弹窗 -->
    <a-modal
      v-model:open="resetPasswordVisible"
      title="重置密码"
      @ok="handleResetPassword"
      :confirm-loading="resetLoading"
    >
      <a-form :model="resetPasswordForm" layout="vertical">
        <a-form-item label="新密码">
          <a-input-password
            v-model:value="resetPasswordForm.password"
            placeholder="请输入新密码（留空则自动生成）"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 更改角色弹窗 -->
    <a-modal
      v-model:open="changeRoleVisible"
      title="更改角色"
      @ok="handleChangeRole"
      :confirm-loading="changeRoleLoading"
    >
      <a-form :model="changeRoleForm" layout="vertical">
        <a-form-item label="选择角色">
          <a-select v-model:value="changeRoleForm.roleId" placeholder="请选择角色">
            <a-select-option v-for="role in roleList" :key="role.id" :value="role.id">
              {{ role.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { KeyOutlined, TeamOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'
import { changeUserRole } from '@/api/user'
import { getRolePage } from '@/api/role'
import type { Role } from '@/types'

const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo || {})

const userTypeText = computed(() => {
  return userInfo.value.userType === 1 ? '后台用户' : '未知'
})

const sexText = computed(() => {
  if (userInfo.value.sex === 1) return '男'
  if (userInfo.value.sex === 2) return '女'
  return '-'
})

// 重置密码
const resetPasswordVisible = ref(false)
const resetLoading = ref(false)
const resetPasswordForm = reactive({
  password: ''
})

const showResetPasswordModal = () => {
  resetPasswordForm.password = ''
  resetPasswordVisible.value = true
}

const handleResetPassword = async () => {
  message.info('重置密码功能需要调用后端接口')
  resetPasswordVisible.value = false
}

// 更改角色
const changeRoleVisible = ref(false)
const changeRoleLoading = ref(false)
const changeRoleForm = reactive({
  roleId: undefined as number | undefined
})
const roleList = ref<Role[]>([])

const showChangeRoleModal = async () => {
  changeRoleForm.roleId = userInfo.value.roleId
  changeRoleVisible.value = true
  // 获取角色列表
  try {
    const res = await getRolePage({ current: 1, size: 100 })
    roleList.value = res.records
  } catch (e) {
    // ignore
  }
}

const handleChangeRole = async () => {
  if (!changeRoleForm.roleId) {
    message.warning('请选择角色')
    return
  }
  changeRoleLoading.value = true
  try {
    await changeUserRole({
      userId: userInfo.value.id,
      roleId: changeRoleForm.roleId
    })
    message.success('角色更改成功')
    changeRoleVisible.value = false
    // 刷新用户信息
    await userStore.fetchUserInfo()
  } catch (e) {
    // ignore
  } finally {
    changeRoleLoading.value = false
  }
}
</script>

<style scoped lang="less">
.user-manage {
  :deep(.ant-descriptions-item-label) {
    font-weight: 500;
  }
}
</style>