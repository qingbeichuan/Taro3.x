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
    host = "https://mock.mengxuegu.com/mock/609ab96cc7b7385be0a8363f/example"
    break;
  case 'trial':
    host = "https://mock.mengxuegu.com/mock/609ab96cc7b7385be0a8363f/example"
    break;
  case 'release':
    host = "https://mock.mengxuegu.com/mock/609ab96cc7b7385be0a8363f/example"
    break;
}

export default {
  host
}
