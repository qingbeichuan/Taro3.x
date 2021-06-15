import Taro from '@tarojs/taro'

/**
 * @description: 本地存储
 * @param {string}
 */
export const storage = {
  set(key, val) {
    Taro.setStorageSync(key, val);
  },
  get(key) {
    return Taro.getStorageSync(key);
  },
  remove(key) {
    Taro.removeStorageSync(key);
  }
}

/**
 * @description: 防抖
 * @param {function} fn
 * @param {number} timestamp
 * @return {function}
 */
export function debounce(fn, interval = 400) {
  let timer = null
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, interval)
  }
}

/**
 * @description: 节流
 * @param {function} fn
 * @param {number} timestamp
 * @return {function}
 */
export function throttle(fn, interval = 300) {
  let timer = null
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, arguments)
        timer = null
      }, interval)
    }
  }
}

/**
 * @description: 解析url参数
 * @param {string} url
 * @return {object}
 */
export function urlParse(url) {
  const [obj, reg] = [{}, /[?&][^?&]+=[^?&]+/g]
  const arr = url.search.match(reg);  // ['?id=12345', '&a=b']
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=');
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    });
  }
  return obj;
};
