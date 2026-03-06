import request from '@/utils/request'
import type { LoginReq, SignUpReq, Token, ChangePasswordReq, ResetPasswordReq } from '@/types'

// 用户登录
export function login(data: LoginReq): Promise<Token> {
  return request.post('/user/auth/login', data)
}

// 用户注册
export function signup(data: SignUpReq): Promise<void> {
  return request.post('/user/auth/signup', data)
}

// 用户登出
export function logout(): Promise<void> {
  return request.put('/user/auth/logout')
}

// 刷新 Token
export function refreshToken(token: string): Promise<Token> {
  return request.put(`/user/auth/refreshToken/${token}`)
}

// 修改密码
export function changePassword(data: ChangePasswordReq): Promise<void> {
  return request.post('/user/auth/changePassword', data)
}

// 重置密码（管理员）
export function resetPassword(data: ResetPasswordReq): Promise<void> {
  return request.post('/user/auth/resetPassword', data)
}

// 获取当前用户信息
export function getUserInfo(): Promise<any> {
  return request.get('/user/manage/info')
}