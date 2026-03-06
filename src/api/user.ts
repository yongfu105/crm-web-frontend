import request from '@/utils/request'
import type { User, ChangeRoleReq } from '@/types'

// 获取当前用户信息
export function getUserInfo(): Promise<User> {
  return request.get('/user/manage/info')
}

// 更改用户角色
export function changeUserRole(data: ChangeRoleReq): Promise<void> {
  return request.post('/user/manage/changeUserRole', data)
}