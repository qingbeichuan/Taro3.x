import http from "./http"

export const getBannerList = (params) => {
  return http.get('/api/white-screen/search', params)
}