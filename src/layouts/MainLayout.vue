<template>
  <a-layout class="main-layout">
    <!-- 侧边栏 -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      theme="light"
      class="sider"
    >
      <div class="logo">
        <span v-if="!collapsed">CRM管理系统</span>
        <span v-else>CRM</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        mode="inline"
        theme="light"
      >
        <a-menu-item key="dashboard" @click="$router.push('/dashboard')">
          <template #icon><HomeOutlined /></template>
          <span>首页</span>
        </a-menu-item>
        <a-sub-menu key="system">
          <template #icon><SettingOutlined /></template>
          <template #title>系统管理</template>
          <a-menu-item key="user" @click="$router.push('/system/user')">
            <UserOutlined />
            <span>用户管理</span>
          </a-menu-item>
          <a-menu-item key="role" @click="$router.push('/system/role')">
            <TeamOutlined />
            <span>角色管理</span>
          </a-menu-item>
          <a-menu-item key="permission" @click="$router.push('/system/permission')">
            <LockOutlined />
            <span>权限管理</span>
          </a-menu-item>
          <a-menu-item key="config" @click="$router.push('/system/config')">
            <ToolOutlined />
            <span>系统配置</span>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <!-- 右侧主体 -->
    <a-layout>
      <!-- 顶部导航 -->
      <a-layout-header class="header">
        <div class="header-left">
          <menu-fold-outlined
            v-if="!collapsed"
            class="trigger"
            @click="collapsed = true"
          />
          <menu-unfold-outlined
            v-else
            class="trigger"
            @click="collapsed = false"
          />
        </div>
        <div class="header-right">
          <a-dropdown>
            <div class="user-info">
              <a-avatar :style="{ backgroundColor: '#1890ff' }">
                {{ userStore.realName?.charAt(0) || 'U' }}
              </a-avatar>
              <span class="username">{{ userStore.realName || userStore.username }}</span>
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item key="profile">
                  <UserOutlined />
                  个人信息
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout">
                  <LogoutOutlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- 内容区域 -->
      <a-layout-content class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  TeamOutlined,
  LockOutlined,
  ToolOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const collapsed = ref(false)
const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>(['system'])

// 根据路由设置选中的菜单
watch(
  () => route.path,
  (path) => {
    if (path.includes('/system/user')) {
      selectedKeys.value = ['user']
      openKeys.value = ['system']
    } else if (path.includes('/system/role')) {
      selectedKeys.value = ['role']
      openKeys.value = ['system']
    } else if (path.includes('/system/permission')) {
      selectedKeys.value = ['permission']
      openKeys.value = ['system']
    } else if (path.includes('/system/config')) {
      selectedKeys.value = ['config']
      openKeys.value = ['system']
    } else if (path.includes('/dashboard')) {
      selectedKeys.value = ['dashboard']
    }
  },
  { immediate: true }
)

const handleLogout = async () => {
  await userStore.logout()
  message.success('退出成功')
  router.push('/login')
}
</script>

<style scoped lang="less">
.main-layout {
  min-height: 100vh;
}

.sider {
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: #1890ff;
  border-bottom: 1px solid #f0f0f0;
}

.header {
  background: #fff;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
}

.trigger {
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #1890ff;
  }
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;

  .username {
    margin-left: 8px;
    color: #333;
  }
}

.content {
  margin: 16px;
  padding: 24px;
  background: #fff;
  border-radius: 4px;
  min-height: calc(100vh - 64px - 32px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>