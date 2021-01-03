import axios from 'axios';
import store from "@/store";
import qs from 'qs';

//API地址
const BASE_URL = 'https://api.daily.luanrz.cn';

//设置默认的api地址
axios.defaults.baseURL = BASE_URL;

//设置默认的请求头
// axios.defaults.headers =  { 'content-type': 'application/x-www-form-urlencoded' }

//设置默认的请求超时时间
axios.defaults.timeout = 10000;

//请求拦截
axios.interceptors.request.use(
    config => {
        config.headers.jwt = store.getJwt();
        console.log('请求拦截', config);
        return config;
    },
    error => {
        console.log('请求拦截出错', error)
        return Promise.reject(error);
    })

//响应拦截
axios.interceptors.response.use(
    res => {
        console.log('响应拦截', res)
        var errorCode = res.data.errorCode
        var errorMsg = res.data.errorMsg
        if (errorCode){
            return Promise.reject("【" + errorCode + "】" + errorMsg)
        }
        return Promise.resolve(res)
    },
    err => {
        console.log('响应拦截出错', err);
        var status = err.response.status;
        if (status === 404) {
            return Promise.reject("【404】请求服务繁忙");
        }
        if (status === 500) {
            return Promise.reject("【500】内部服务错误");
        }else {
            return Promise.reject("未知错误");
        }
    })

//get方法
export const get = (url, params) => {
    return axios({
        method: 'get',
        url: url,
        params: params
    });
}

//post方法
export const post = (url, params) => {
    return axios({
        method: 'post',
        url: url,
        data: qs.stringify(params)
    })
}

//put方法
export const put = (url, params) => {
    return axios({
        method: 'put',
        url: url,
        data: qs.stringify(params)
    })
}

//delete方法
export const del = (url, params) => {
    return axios({
        method: 'delete',
        url: url,
        data: qs.stringify(params)
    })
}