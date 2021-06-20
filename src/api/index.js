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

export const getToken = (params) => {
  return http.get('/getToken', params)
}

export const jsCode2Openid = (params)=>{
  return http.get('/jsCode2Openid', params);
}

export const fetchUserInfoById = (params) => {
  return http.get('/member/userInfo', params)
}