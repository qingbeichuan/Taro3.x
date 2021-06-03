import http from "./http"

export const getBannerList = (params) => {
  return http.get('/h5/test', params)
}