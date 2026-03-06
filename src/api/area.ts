import request from '@/utils/request'
import type { Area } from '@/types'

// 获取省份列表
export function getProvinces(): Promise<Area[]> {
  return request.get('/sys/area/listProvinces')
}

// 根据父级ID获取子区域列表
export function getAreasByParentId(id: number): Promise<Area[]> {
  return request.get(`/sys/area/listByParentId/${id}`)
}

// 根据ID获取区域信息
export function getAreaById(id: number): Promise<Area> {
  return request.get(`/sys/area/getById/${id}`)
}

// 获取区域树结构
export function getAreaTree(id: number): Promise<Area> {
  return request.get(`/sys/area/getTree/${id}`)
}

// 获取区域路径
export function getAreaPath(id: number): Promise<Area[]> {
  return request.get(`/sys/area/listPath/${id}`)
}

// 根据名称搜索区域
export function searchArea(name: string, level: number): Promise<Area[]> {
  return request.get('/sys/area/searchByName', { params: { name, level } })
}