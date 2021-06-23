import http from "./http"

export const getGiftCardListCount = (params) => {
  return http.get('/card/giftCardListCount', params)
}

export const getCouponList = (params) => {
  return http.get('/coupon/couponCount', params)
}

export const getRightsList = (params) => {
  return http.get('/level/rights/list', params)
}

/**
 * @description:  获取token
 * @param {object} params
 */
export const getToken = (params) => {
  return http.get('/getToken', params)
}

/**
 * @description:  获取openId和unionId
 * @param {object} params
 * @param {object} params.jscode 登录凭证的code
 */
export const jsCode2Openid = (params)=>{
  return http.get('/jsCode2Openid', params);
}

/**
 * @description: 登录获取会员信息
 * @param {object} params 
 * @param {string} params.name 用户昵称
 * @param {string} params.mobile 用户手机号
 * @param {object} options 自由配置
 */
export const fetchUserInfo = (params, options) => {
  return http.get('/member/userInfo', params, options)
}

/**
 * @description: 解密获取手机号
 * @param {object} params
 * @param {string} params.encryptedData 要解密的字符串
 * @param {string} params.iv 定义对称解密算法初始向量 iv
 */
export const encryptedData = (params)=>{
  return http.get('/encryptedData', params)
}

/**
 * @description: 用户注册
 * @param {object} params
 * @param {string} params.mobile 手机号
 * @param {string} params.gender 性别 1男2女
 * @param {string} params.birth 生日 
 * @param {string} params.shopId 门店Id
 * @param {string} params.acceptPic 头像
 */
export const userRegister = (params) => {
  return http.post('/member/registerUser', params)
}

/**
 * @description: 获取短信验证码
 * @param {object} params
 * @param {string} params.mobile 手机号
 * @param {string} params.imgCode 图片验证码
 */
export const sendCode = (params)=>{
  return http.post('/sms/sendCode', params);
}

/**
 * @description: 注册校验短信验证码
 * @param {object} params
 * @param {string} params.mobile 手机号
 * @param {string} params.smsCode 短信验证码
 */
export const checkCode = (params)=>{
  return http.post( '/sms/checkCode', params);
}