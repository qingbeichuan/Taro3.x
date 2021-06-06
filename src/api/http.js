import Taro from '@tarojs/taro'
import config from './config'
import { storage } from '@/utils/tools'

class Http {
  constructor() {
    this.isRefreshing = true,
    this.subscribers = []
    Taro.addInterceptor(this.customInterceptor)
    Taro.addInterceptor(Taro.interceptors.logInterceptor)
  }
  _addSubscriber(callback) {
    this.subscribers.push(callback)
  }
  _onAccessTokenFetched(token) {
    this.subscribers.forEach((callback) => {
      callback(token);
    })
    this.subscribers = [];
  }
  _request(params) {
    let { 
      url, 
      contentType = 'form',
      loading = false,
      succToast = false,
      errToast = true,
    } = params
    contentType = contentType == 'form' ? 'application/x-www-form-urlencoded' : 'application/json;charset=utf-8'
    const options = {
      succToast,
      errToast,
      header: {
        'Content-Type': contentType,
        ...config.commonParams,
        token: storage.get('token'),
      },
      timeout: 5000,
      ...params,
      url: url.includes('http') ? url : `${config.host}${url}`,
    }
    loading && Taro.showLoading({
      title: loading,
    })
    return Taro.request(options)
  }
  _showToast(msg) {
    Taro.showToast({
      title: msg,
      icon: 'none'
    })
  }
  
  customInterceptor = (chain) => {
    const requestParams = chain.requestParams
    // console.log('requestParams',requestParams);
    const { succToast, errToast, header } = requestParams
    if (requestParams['data']) {
      requestParams['data']['token'] = storage.get('token')
    }
    // console.log('header', header)
    header['token'] = storage.get('token')
    return chain.proceed(requestParams).then(res => {
      const { statusCode, data: _data } = res
      if (statusCode == 200) {
        const { errcode, data, msg } = _data
        if (errcode == 0) {
          succToast && this._showToast(msg)
          return data
        } else if (errcode == 401) {
          this._addSubscriber((token) => {
            this._request({ ...requestParams })
          })
          if (this.isRefreshing) {
            this.updateToken().then((token) => {
              // 依次去执行缓存的接口
              this._onAccessTokenFetched(token);
              this.isRefreshing = true;
            })
          }
          this.isRefreshing = false;
        } else {
          errToast && this._showToast(msg)
          return res
        }
      } else if (statusCode === 401) {
        this.updateToken().then(() => {
          this._request({ ...requestParams })
       })
      } else {
        this._showToast(config.codeMessage[statusCode])
        return Promise.reject(res)
      }
    })
  }
  updateToken() {
    return new Promise((resolve, reject) => {
      Taro.login({
        success({ code }) {
          Taro.request({
            url: `${config.host}/getToken`,
            header: {
              ...config.commonParams
            },
            data: {
              ...config.commonParams
            },
            success(res) {
              const { errcode, data: { token } } = res.data;
              if (errcode == 0) {
                Taro.setStorageSync('token', token);
                resolve(token);
              }
            }
          })
        },
        fail(err) {
          reject()
          console.error('wx login fail', err);
        }
      });
    })
  }
  get(url, options) {
    return this._request({
      method: 'GET',
      url,
      ...options
    })
  }
  post(url, options) {
    return this._request({
      method: 'POST',
      url,
      ...options
    })
  }
}

export default new Http