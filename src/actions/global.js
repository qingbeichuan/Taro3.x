import {
  CHECK_AUTH_STATUS,
  HANDLE_AUTH,
  GET_MEMBER_INFO,
  UPDATE_TOKRN
} from '../constants/global'
import { storage } from '@/utils/tools'
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
 * @return {object}
 */
export const getMemberInfo = (name) => {
  return async dispatch => {
    try {
      const memberInfo = await Api.fetchUserInfoById({ name })
      storage.set('memberInfo', memberInfo)
      const { userId } = memberInfo
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
        // this.trackRegister()
        this.setState({ isLoading: false, userInfo: userInfoCache, isRegister: false, panelRegisterShow: true });
      } else if (err.errcode == 1001241) {
        console.log('手机号已登出');
        let mobile = err.data;
        this.trackRegister()
        this.setState({ isLoading: false, userInfo: userInfoCache, isRegister: false, panelRegisterShow: true });
        // this.setState({isLoading:false, userInfo:userInfoCache, mobile, showPanel:true, panelMsg:'您好，请您通过手机号: '+mobile+'进行验证登录'})
      } else if (err.errcode == 100130) {
        console.log('账户已被禁用')
        this.setState({ isLoading: false, userInfo: userInfoCache })
        Taro.showModal({
          content: '您的账户已被禁用',
          showCancel: false,
          success: () => {
            this.fetchUserInfoById()
          }
        })
      } else {
        this.setState({ isLoading: false, userInfo: userInfoCache })
        Taro.showModal({
          content: err.msg || '内部错误',
          showCancel: false,
          success: () => {
            this.fetchUserInfoById()
          }
        })
      }
    }
  }
}