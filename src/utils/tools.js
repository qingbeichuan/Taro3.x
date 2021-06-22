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
  let [result, h] = [{}, ''];
  const hash = url.slice(url.indexOf("?") + 1).split('&');
  for (let i = 0; i < hash.length; i++) {
    h = hash[i].split("=");
    result[h[0]] = h[1];
  }
  return result;
};


/**
 * @description: 日期格式化
 * @param {string} date
 * @param {string} fmt 格式化方式如： YYYY-mm-DD HH:MM:SS
 * @return {string}
 */
 export function dateFormat(date, fmt) {
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": (date.getMonth() + 1).toString(), // 月
    "D+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString() // 秒
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return fmt;
}

/**
 * @description: 判断是否为空对象
 * @param {obj} object
 * @return {boolean}
 */
export function isEmptyObject(obj) {
  return Object.keys(obj).length == 0
}