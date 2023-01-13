import Request from './request'

const request = new Request({ baseURL: '/api' })

export interface UserInfo {
  phone: number
  id: string
  name: string
}

export default class User {
  static getUserInfo() {
    return request.get<UserInfo>('/user', {})
  }
}
