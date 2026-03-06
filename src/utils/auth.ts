// Token 管理工具
const TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_KEY = 'userInfo'

export const TokenUtil = {
  // 获取 Access Token
  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  // 设置 Access Token
  setAccessToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  },

  // 获取 Refresh Token
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  // 设置 Refresh Token
  setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  },

  // 设置所有 Token
  setTokens(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken)
    this.setRefreshToken(refreshToken)
  },

  // 清除所有 Token
  clearTokens(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  // 检查是否已登录
  isAuthenticated(): boolean {
    return !!this.getAccessToken()
  },

  // 获取用户信息
  getUserInfo(): any {
    const userInfo = localStorage.getItem(USER_KEY)
    return userInfo ? JSON.parse(userInfo) : null
  },

  // 设置用户信息
  setUserInfo(user: any): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}