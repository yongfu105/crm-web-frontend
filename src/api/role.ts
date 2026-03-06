import request from '@/utils/request'
import type {
  Role,
  RoleAddReq,
  RoleUpdateReq,
  RoleDeleteReq,
  RoleStatusEditReq,
  RoleChangePermReq,
  RolePermListReq,
  Permission,
  PageResult
} from '@/types'

// 分页查询角色列表
export function getRolePage(data: { current: number; size: number }): Promise<PageResult<Role>> {
  return request.post('/user/role/rolePage', data)
}

// 添加角色
export function addRole(data: RoleAddReq): Promise<void> {
  return request.post('/user/role/roleAdd', data)
}

// 更新角色信息
export function updateRole(data: RoleUpdateReq): Promise<void> {
  return request.post('/user/role/updateRole', data)
}

// 删除角色
export function deleteRole(data: RoleDeleteReq): Promise<void> {
  return request.post('/user/role/deleteRole', data)
}

// 更新角色状态
export function updateRoleStatus(data: RoleStatusEditReq): Promise<void> {
  return request.post('/user/role/updateRoleStatus', data)
}

// 更新角色权限
export function updateRolePerms(data: RoleChangePermReq): Promise<void> {
  return request.post('/user/role/updatePerms', data)
}

// 查询角色权限列表
export function getRolePerms(data: RolePermListReq): Promise<Permission[]> {
  return request.post('/user/role/listRolePerms', data)
}