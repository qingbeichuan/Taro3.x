import Taro from '@tarojs/taro'

const accountInfo = Taro.getAccountInfoSync();
const {
  envVersion
} = accountInfo.miniProgram;
if (!envVersion) {
  console.error("获取运行环境失败!");
}
let host = ''
switch (envVersion) {
  case 'develop':
    host = "https://test.domain.cn"
    break;
  case 'trial':
    host = "https://test.domain.cn"
    break;
  case 'release':
    host = "https://admin.domain.cn"
    break;
}

export default {
  host
}
