import request from '@/utils/request'

export function deviceQuery(data,labId) {
  return request({
    url: 'student/device/query/'+labId,
    method: 'post',
    data
  })
}

export function borrowDevice(data) {
  return request({
    url: 'student/device/borrow',
    method: 'post',
    data
  })
}

export function storeDevice(data) {
  return request({
    url: 'student/device/store/'+data,
    method: 'put',
  })
}

export function queryBorrow(data,id,labId) {
  return request({
    url: 'student/device/queryBorrow/'+id+'/'+labId,
    method: 'post',
    data
  })
}

export function returnDevice(id,userId) {
  return request({
    url: 'student/device/return/'+id+'/'+userId,
    method: 'post',
  })
}

export function  insertDevice(data) {
  return request({
    url: 'student/device/apply',
    method: 'post',
    data
  })
}

export function updateDevice(data) {
  return request({
    url: 'student/device/update',
    method: 'put',
    data
  })
}

export function deleteDevice(data) {
  return request({
    url: 'student/device/delete/'+data,
    method: 'delete',
  })
}

export function updateUser(data) {
  return request({
    url: 'student/device/update/user',
    method: 'post',
    data
  })
}

export function updateUserPwd(id,pwd) {
  return request({
    url: 'student/device/updatePwd/'+id+'/'+pwd,
    method: 'post',
  })
}

export function getPwd(id,pwd) {
  return request({
    url: 'student/device/getPwd/'+id+'/'+pwd,
    method: 'post',
  })
}