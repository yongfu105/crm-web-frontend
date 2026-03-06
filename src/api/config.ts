import request from '@/utils/request'
import type { SysConfig } from '@/types'

// 获取所有系统配置列表
export function getAllConfigs(): Promise<SysConfig[]> {
  return request.get('/sys/config/list')
}

// 根据键名获取配置信息
export function getConfig(key: string): Promise<SysConfig> {
  return request.get(`/sys/config/getConfig/${key}`)
}

// 更新配置信息
export function updateConfig(data: SysConfig): Promise<void> {
  return request.post('/sys/config/updateConfig', data)
}

// 删除配置信息
export function deleteConfig(key: string): Promise<void> {
  return request.delete(`/sys/config/deleteConfig/${key}`)
}