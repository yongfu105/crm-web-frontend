import { defineStore } from 'pinia'
import { getMenuList } from '@/api/permission'
import type { Permission } from '@/types'

interface PermissionState {
  menuList: Permission[]
  permissions: string[]
  routesLoaded: boolean
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    menuList: [],
    permissions: [],
    routesLoaded: false
  }),

  getters: {
    hasPermission: (state) => (perm: string) => {
      return state.permissions.includes(perm) || state.permissions.includes('*')
    }
  },

  actions: {
    async fetchMenuList(): Promise<Permission[]> {
      const menus = await getMenuList()
      this.menuList = menus
      this.extractPermissions(menus)
      this.routesLoaded = true
      return menus
    },

    extractPermissions(menus: Permission[]): void {
      const perms: string[] = []
      const extract = (list: Permission[]) => {
        list.forEach(item => {
          if (item.permissionSign) {
            perms.push(item.permissionSign)
          }
          if (item.children && item.children.length > 0) {
            extract(item.children)
          }
        })
      }
      extract(menus)
      this.permissions = perms
    },

    clearPermission(): void {
      this.menuList = []
      this.permissions = []
      this.routesLoaded = false
    }
  }
})