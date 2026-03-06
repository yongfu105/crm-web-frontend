import { defineStore } from 'pinia'
import { login, logout, getUserInfo } from '@/api/auth'
import type { User, LoginReq, Token } from '@/types'
import { TokenUtil } from '@/utils/auth'

interface UserState {
  token: string
  refreshToken: string
  userInfo: User | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: TokenUtil.getAccessToken() || '',
    refreshToken: TokenUtil.getRefreshToken() || '',
    userInfo: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    username: (state) => state.userInfo?.username || '',
    realName: (state) => state.userInfo?.realName || '',
    role: (state) => state.userInfo?.roleId
  },

  actions: {
    async login(loginData: LoginReq): Promise<void> {
      const tokenData: Token = await login(loginData)
      this.token = tokenData.accessToken
      this.refreshToken = tokenData.refreshToken
      TokenUtil.setTokens(tokenData.accessToken, tokenData.refreshToken)
    },

    async fetchUserInfo(): Promise<User> {
      const userInfo = await getUserInfo()
      this.userInfo = userInfo
      TokenUtil.setUserInfo(userInfo)
      return userInfo
    },

    async logout(): Promise<void> {
      try {
        await logout()
      } catch (e) {
        // ignore
      } finally {
        this.token = ''
        this.refreshToken = ''
        this.userInfo = null
        TokenUtil.clearTokens()
      }
    },

    initUserFromStorage(): void {
      const token = TokenUtil.getAccessToken()
      const refreshToken = TokenUtil.getRefreshToken()
      const userInfo = TokenUtil.getUserInfo()

      if (token) {
        this.token = token
        this.refreshToken = refreshToken || ''
        this.userInfo = userInfo
      }
    }
  }
})