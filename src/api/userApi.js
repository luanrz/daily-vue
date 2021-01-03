import {post} from './common/axios'

const USER_LOGIN_URL = "/user/login";

//用户登录
export const login = (username, password) => {
    return post(USER_LOGIN_URL, { username: username, password: password });
}