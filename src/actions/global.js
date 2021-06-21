import {
  CHECK_AUTH_STATUS,
  HANDLE_AUTH,
  GET_MEMBER_INFO,
  CHECK_LOGIN_STATUS
} from '../constants/global'
import {
  storage
} from '@/utils/tools'
import * as Api from '@/api/index'
import http from "../api/http"

/**
 * @description: 检查授权状态
 * @param {boolean} bool true为手动点击
 * @return {object}
 */
export const checkAuthStatus = (bool) => {
  return async dispatch => {
    dispatch({
      type: CHECK_AUTH_STATUS,
      payload: {
        isAuthorized: !!storage.get('userInfo'),
        userClick: bool
      }
    })
  }
}

/**
 * @description: 取消和确认授权
 * @param {boolean} status
 * @return {object}
 */
export const handleAuth = (status) => {
  return {
    type: HANDLE_AUTH,
    payload: {
      isAuthorized: status
    }
  }
}

/**
 * @description: 登录获取用户信息
 * @param {string} name 用户昵称
 * @return {function}
 */
export const getMemberInfo = (name) => {
  return async dispatch => {
    try {//用户存在
      const memberInfo = await Api.fetchUserInfo({
        name
      })
      storage.set('memberInfo', memberInfo)
      const {
        userId
      } = memberInfo
      userId && await http.updateToken()
      dispatch({
        type: GET_MEMBER_INFO,
        payload: {
          memberInfo
        }
      })
    } catch (err) {
      if (err.errcode == 100124) {
        console.log('会员不存在');
      } else if (err.errcode == 1001241) {
        console.log('手机号已登出');

      } else if (err.errcode == 100130) {
        console.log('账户已被禁用')
  
      } else {
        
      }
    }
  }
}

/**
 * @description: 检查登陆状态
 * @param {boolean} bool true为手动点击
 * @return {object}
 */
 export const checkLoginStatus = (bool) => {
  return async dispatch => {
    dispatch({
      type: CHECK_LOGIN_STATUS,
      payload: {
        isLogined: !!storage.get('memberInfo'),
      }
    })
  }
}