import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'
import { TokenUtil } from '@/utils/auth'

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error/403.vue'),
    meta: { title: '无权限', requiresAuth: false }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'home' }
      }
    ]
  },
  {
    path: '/system',
    name: 'System',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'setting' },
    children: [
      {
        path: 'user',
        name: 'UserManage',
        component: () => import('@/views/system/user/index.vue'),
        meta: { title: '用户管理', icon: 'user' }
      },
      {
        path: 'role',
        name: 'RoleManage',
        component: () => import('@/views/system/role/index.vue'),
        meta: { title: '角色管理', icon: 'team' }
      },
      {
        path: 'permission',
        name: 'PermissionManage',
        component: () => import('@/views/system/permission/index.vue'),
        meta: { title: '权限管理', icon: 'lock' }
      },
      {
        path: 'config',
        name: 'ConfigManage',
        component: () => import('@/views/system/config/index.vue'),
        meta: { title: '系统配置', icon: 'tool' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '页面不存在', requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
})

// 白名单路由
const whiteList = ['/login', '/403', '/404']

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title || 'CRM'} - CRM管理系统`

  const hasToken = TokenUtil.isAuthenticated()

  if (hasToken) {
    if (to.path === '/login') {
      // 已登录，跳转首页
      next({ path: '/' })
    } else {
      const userStore = useUserStore()
      const permissionStore = usePermissionStore()

      // 检查是否已获取用户信息
      if (!userStore.userInfo) {
        try {
          await userStore.fetchUserInfo()
          await permissionStore.fetchMenuList()
          next()
        } catch (error) {
          // 获取用户信息失败，清除 token 并跳转登录
          await userStore.logout()
          next('/login')
        }
      } else {
        next()
      }
    }
  } else {
    // 未登录
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router