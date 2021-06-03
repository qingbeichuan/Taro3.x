import Taro from '@tarojs/taro'
import { host } from './config'

class Http {
  request(options) {
    let {
      url,
      data,
      method,
      loading = false,
      succToast = false,
      errToast = true,
      contentType = 'json',
    } = options
    contentType = contentType == 'form' ? 'application/x-www-form-urlencoded' : 'application/json;charset=utf-8'
    loading && Taro.showLoading({
      title: loading,
    })
    return Taro.request({
      url: `${host}${url}`,
      method,
      data,
      header: {
        'Content-Type': contentType,
      },
      success(res) {
        loading && Taro.hideLoading()
        const {
          data: {
            errcode,
            data,
            msg,
          }
        } = res
        if (errcode == 0) {
          resolve(data)
          succToast && Taro.showToast({
            title: succToast,
            icon: 'none'
          })
        } else {
          errToast && Taro.showToast({
            title: msg,
            icon: 'none'
          })
          reject(res.data)
        }
      },
      fail({ data }) {
        const { message } = data
        Taro.showToast({
          title: message,
          icon: 'none'
        })
        reject(data)
      }
    })
  }
  get(options) {
    return this.request({
      method: 'GET',
      ...options
    })
  }
  post(options) {
    return this.request({
      method: 'POST',
      ...options
    })
  }
}

export default new Http