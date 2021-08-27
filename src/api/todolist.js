import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/todolist/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/todolist/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/todolist/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/todolist/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/todolist/update',
    method: 'post',
    data
  })
}
