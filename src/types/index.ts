// 用户相关类型
export interface User {
  id: number
  username: string
  realName: string
  userType: number
  email: string
  phone: string
  sex: number
  age: number
  status: number
  lastLoginTime: string
  roleId: number
}

export interface BaseUser {
  id: number
  username: string
  realName: string
  userType: string
  role: string
  roles: string[]
  status: number
}

export interface Token {
  accessToken: string
  refreshToken: string
}

// 角色相关类型
export interface Role {
  id: number
  name: string
  roleSign: string
  description: string
  status: number
}

export interface RoleAddReq {
  name: string
  roleSign: string
  description: string
  isSystem: number
}

export interface RoleUpdateReq extends RoleAddReq {
  id: number
}

export interface RoleDeleteReq {
  id: number
}

export interface RoleStatusEditReq {
  id: number
  status: number
}

export interface RoleChangePermReq {
  id: number
  permIds: number[]
}

export interface RolePermListReq {
  roleId: number
}

// 权限相关类型
export interface Permission {
  id: number
  permissionSign: string
  name: string
  description: string
  url: string
  parentId: number
  type: number
  orderNum: number
  icon: string
  status: number
  createDate: string
  modifyDate: string
  children: Permission[]
}

export interface PermissionAddReq {
  permissionSign: string
  name: string
  description?: string
  url?: string
  parentId: number
  type: number
  orderNum?: number
  icon?: string
}

export interface PermissionUpdateReq extends PermissionAddReq {
  id: number
}

export interface PermissionDeleteReq {
  id: number
}

// 区域相关类型
export interface Area {
  id: number
  code: number
  name: string
  parentId: number
  level: number
  children: Area[]
}

// 系统配置相关类型
export interface SysConfig {
  configKey: string
  configValue: string
  description: string
}

// 认证相关请求类型
export interface LoginReq {
  userType: number
  username: string
  password: string
}

export interface SignUpReq {
  username: string
  password: string
  userType: number
  roleId?: number
  realName?: string
  email?: string
  phone?: string
  age?: number
  sex?: number
}

export interface ChangePasswordReq {
  password: string
}

export interface ResetPasswordReq {
  userId: number
  password?: string
}

export interface ChangeRoleReq {
  userId: number
  roleId: number
}

// 分页相关类型
export interface PageReq {
  current: number
  size: number
}

export interface PageResult<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

// API 响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}