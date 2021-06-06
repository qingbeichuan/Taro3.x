export const storage = {
  set(key, val) {
    wx.setStorageSync(key, val);
  },
  get(key) {
    return wx.getStorageSync(key);
  },
  remove(key) {
    wx.removeStorageSync(key);
  }
}