import request from '@/utils/request'

export function getList() {
  return request({
    url: '/roles',
    method: 'get'
  })
}
