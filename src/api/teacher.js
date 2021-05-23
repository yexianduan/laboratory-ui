import request from '@/utils/request'

export function deviceVerify(data,labId) {
    return request({
        url: '/teacher/verify/query/'+labId,
        method: 'post',
        data
    })
}

export function verifyDevice(deviceId, status,phone) {
    return request({
        url: '/teacher/verify/' + deviceId+'/'+status+'/'+phone,
        method: 'post',
    })
}

export function queryDeviceBorrow(data,labId) {
    return request({
        url: '/teacher/verify/queryBorrow/'+labId,
        method: 'post',
        data
    })
}
export function verifyBorrow(deviceId,status,userId) {
    return request({
        url: '/teacher/verify/borrow/' + deviceId+'/'+status+'/'+userId,
        method: 'post',
    })
}
export function queryUserRole(data) {
    return request({
        url: '/teacher/verify/queryRole',
        method: 'post',
        data
    })
}

export function stopRole(id,status) {
    return request({
        url: '/teacher/verify/stopRole/'+id+'/'+status,
        method: 'post',
    })
}
export function insertRole(data) {
    return request({
        url: '/teacher/verify/insertRole',
        method: 'post',
        data
    })
}
export function deleteRole(id) {
    return request({
        url: '/teacher/verify/deleteRole/'+id,
        method: 'post',
    })
}

export function editMenu(id,data) {
    return request({
        url: '/teacher/verify/menu/'+id,
        method: 'post',
        data
    })
}

export function insertUserRole(id,roleId) {
    return request({
        url: '/teacher/verify/insertUserRole/'+id+'/'+roleId,
        method: 'post',
    })
}
export function remindReturn(phone) {
    return request({
        url: '/teacher/verify/remind/'+phone,
        method: 'post',
    })
}

export function verifyCode(code) {
    return request({
        url: '/teacher/verify/test/'+code,
        method: 'post',
    })
}

export function statisticsBorrow(id) {
    return request({
        url: '/teacher/verify/chart/borrow/'+id,
        method: 'post',
    })
}

export function statisticsReturn(id) {
    return request({
        url: '/teacher/verify/chart/return/'+id,
        method: 'post',
    })
}

export function queryLabByName(data) {
    return request({
        url: '/teacher/verify/queryLab',
        method: 'post',
        data
    })
}

export function deleteLab(id) {
    return request({
        url: '/teacher/verify/deleteLab/'+id,
        method: 'delete',
    })
}

export function insertLab(data) {
    return request({
        url: '/teacher/verify/insertLab',
        method: 'post',
        data
    })
}

export function updateLab(data) {
    return request({
        url: '/teacher/verify/updateLab',
        method: 'post',
        data
    })
}

export function getLab(dta) {
    return request({
        url: '/teacher/verify/getLab',
        method: 'post'
    })
}
