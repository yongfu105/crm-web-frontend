import request from '@/utils/request'
import type { Permission, PermissionAddReq, PermissionUpdateReq, PermissionDeleteReq } from '@/types'

// 获取当前用户菜单权限
export function getMenuList(): Promise<Permission[]> {
  return request.get('/user/permission/listMenu')
}

// 获取所有权限列表
export function getAllPermissions(): Promise<Permission[]> {
  return request.get('/user/permission/listAll')
}

// 添加权限
export function addPermission(data: PermissionAddReq): Promise<void> {
  return request.post('/user/permission/add', data)
}

// 更新权限
export function updatePermission(data: PermissionUpdateReq): Promise<void> {
  return request.post('/user/permission/update', data)
}

// 删除权限
export function deletePermission(data: PermissionDeleteReq): Promise<void> {
  return request.delete('/user/permission/delete', { data })
}