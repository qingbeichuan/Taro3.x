import Taro from '@tarojs/taro'
import config from './config'

class Http {
  async request(params) {
    let { 
      url, 
      contentType,
      loading = false,
      succToast = false,
      errToast = true,
    } = params
    contentType = contentType == 'form' ? 'application/x-www-form-urlencoded' : 'application/json;charset=utf-8'
    const options = {
      ...params,
      url: `${config.host}${url}`,
    }
    loading && Taro.showLoading({
      title: loading,
    })
    try {
      const res = await Taro.request(options)
      console.log(res);
      loading && Taro.hideLoading()
      const {
        data: {
          code,
          data,
          msg,
        }
      } = res
      if (code == 0) {
        succToast && Taro.showToast({
          title: succToast,
          icon: 'none'
        })
        return data
      } else {
        errToast && Taro.showToast({
          title: msg,
          icon: 'none'
        })
        return res
      }
    } catch (error) {
      const { message } = error
      Taro.showToast({
        title: message,
        icon: 'none'
      })
      return data
    }
  }
  get(url, options) {
    return this.request({
      method: 'GET',
      url,
      ...options
    })
  }
  post(url, options) {
    return this.request({
      method: 'POST',
      url,
      ...options
    })
  }
}

export default new Http