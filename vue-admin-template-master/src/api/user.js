//引入axios(axios的二次封装)
import request from '@/utils/request'

//暴露登录接口的函数
export function login(data) {
  return request({
    url: '/admin/acl/index/login',
    method: 'post',
    data
  })
}

//暴露获取用户信息的函数
export function getInfo(token) {
  return request({
    url: '/admin/acl/index/info',
    method: 'get',
    params: { token }
  })
}

//暴露退出登录的函数
export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}
