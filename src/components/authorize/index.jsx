import Taro from '@tarojs/taro'
import { Component } from 'react'
import { connect } from 'react-redux'
import { View, Button, Image, Text, Input } from '@tarojs/components'
import { handleAuth, getMemberInfo } from '@/actions/global'
import { storage } from '@/utils/tools'
import * as Api from '@/api/index'
import { isEmptyObject } from '@/utils/tools'
import { AtMessage } from 'taro-ui'
import config from '../../api/config'
import './index.scss'

const Env = Taro.getEnv();
const canIUseGetUserProfile = Env === 'WEAPP' ? !!wx.getUserProfile : false;
let timer = null

@connect(({ global }) => ({
  userInfo: global.userInfo,
  userClick: global.userClick,
  memberInfo: global.memberInfo
}), (dispatch) => ({
  handleAuth(status) {
    dispatch(handleAuth(status))
  },
  getMemberInfo: para => dispatch(getMemberInfo(para))
}))
class Authorize extends Component {
  static props = {
    onUpdate: () => { }
  }
  state = {
    memberInfo: storage.get('memberInfo') || {},
    phoneInput: '',
    codeInput: '',
    yzmInput: '',
    counter: 60,
  }
  // componentWillReceiveProps (nextProps) {
  //   if (this.props.memberInfo !== nextProps.memberInfo) {
  //     this.props.onUpdate()
  //   }
  // }

  static getDerivedStateFromProps(props, state) {
    if (JSON.stringify(props.memberInfo) !== JSON.stringify(state.memberInfo)) {
      props.onUpdate()
      return {
        memberInfo: props.memberInfo
      }
    }
    return null
  }

  confirmAuthrize(res) {
    if (Env === 'ALIPAY') {
      Taro.getOpenUserInfo({
        fail: (res) => {
          console.log(res);
        },
        success: (res) => {
          let userInfo = JSON.parse(res.response).response;
          userInfo.avatarUrl = userInfo.avatar;
          userInfo && Taro.setStorageSync('userInfo', userInfo);
          this.props.userInfoAuthorized(userInfo);
        }
      });
    } else if (Env === 'WEAPP') {
      const { encryptedData, iv, userInfo } = res.detail;
      encryptedData && Taro.setStorageSync('encryptedData', encryptedData);
      iv && Taro.setStorageSync('iv', iv);
      userInfo && Taro.setStorageSync('userInfo', userInfo);
      this.props.userInfoAuthorized(userInfo);
    }
  }

  handleProfileAuthorize = () => {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: ({ userInfo }) => {
        storage.set('userInfo', userInfo)
        this.props.handleAuth(false)//先置为false，防止登陆弹框闪烁
        this.userLogin(userInfo.nickName)
      },
      fail: () => {
        console.log('拒绝授权')
      }
    })
  }

  userLogin = (name) => {//授权完成之后登陆
    wx.login({
      success: async ({ code }) => {
        try {
          const { openId, unionid: unionId } = await Api.jsCode2Openid({ jscode: code });
          storage.set('openId', openId)
          storage.set('unionId', unionId)
          await this.props.getMemberInfo({name})
          Taro.atMessage({
            'message': '登陆成功',
            'type': 'success',
          })
        } catch (err) {
          console.log('err', err.msg);
        }
      },
      fail: (err) => {
        log.error('wx.login超时,' + JSON.stringify(err));
      }
    })
  }

  phoneAuthorized = async res => {
    if (Env == "WEAPP") {
      try {
        const { encryptedData, iv } = res.detail;
        if (encryptedData) {
          const { purePhoneNumber: mobile } = await Api.encryptedData({
            encryptedData,
            iv
          })
          this.mobileNext(mobile)
        }
      } catch (err) {
        console.log('解密失败', err)
      }
    } else if (Env == "ALIPAY") {
      my.getPhoneNumber({
        success: (res) => {
          const { response, sign } = JSON.parse(res.response);
          Api.encryptedData(response, sign).then((res) => {
            const { mobile } = JSON.parse(res.data);
            if (mobile) {
              this.mobileNext(mobile);
            } else {
              Taro.showModal({ content: '获取手机号失败', showCancel: false })
            }
          }).catch((err) => {
            Taro.showModal({ content: err.msg, showCancel: false })
          })
        },
        fail: (res) => {
          console.log(res);
          Taro.showModal({ content: '获取手机号失败', showCancel: false })
        }
      })
    }
  }

  async mobileNext(mobile) {//手机号注册检查是否是会员
    try {
      await this.props.getMemberInfo({ mobile })
    } catch (err) {
      console.log('err', err)
      if (err.errcode == 100124) {//会员不存在
        const { 
          userInfo: { 
            gender, 
            birth = '', 
            avatarUrl, 
            nickName: name 
          }
        } = this.props;
        if (Env == "ALIPAY") gender = gender == 'm' ? 1 : 0;
        const shopId = storage.get('shopId');
        try {
          await Api.userRegister({
            mobile, 
            gender, 
            birth, 
            shopId,
            acceptPic: avatarUrl,
            name
          })
          await this.props.getMemberInfo({ mobile })
          Taro.atMessage({
            'message': '登陆成功',
            'type': 'success',
          })
          this.setState({
            panelYzmShow: false
          })
        } catch (error) {
          console.log(error)
        }
      }
    }
  }


  closeYzmPanel = () => {
    this.setState({ panelYzmShow: false, yzmInput: '', phoneInput: '', codeInput: '' })
  }

  handleInput = (type) => {
    return (e) => {
      this.setState({
        [type]: e.target.value
      }, () => {
        console.log(this.state);
      })
    }
  }

  getCaptcha = () => {
    this.setState({ 
      codeImg: config.host+'/sms/getImageCode?version='+config.commonParams.version+'&openid='+storage.get('openId')+'&v='+Math.floor(Math.random()*1000) 
    })
  }

  openYzmRegister = () => {
    this.getCaptcha();
    this.setState({ panelYzmShow: true })
  }

  subimitFun = async () => {
    const { codeInput, phoneInput, yzmInput } = this.state;
    if (phoneInput == '' || phoneInput.length < 11) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    if (codeInput == '') {
      Taro.showToast({ title: '请输入图形验证码', icon: 'none' });
      return;
    }
    if (yzmInput == '') {
      Taro.showToast({ title: '请输入短信验证码', icon: 'none' });
      return;
    }
    try {
      await Api.checkCode({ mobile: phoneInput, smsCode: yzmInput })
      this.mobileNext(phoneInput);
    } catch (error) {
      Taro.showToast({ title: err.msg||'内部错误', icon: 'none' });
    }
  }

  sendCode = async () => {
    const { codeInput, phoneInput, counter } = this.state;
    if (timer) return;
    if (!(/^1[3456789]\d{9}$/.test(phoneInput))) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    try {
      await Api.sendCode({ mobile: phoneInput, imgCode: codeInput })
      Taro.showToast({ title: '短信发送成功', icon: 'none' })
      timer = setInterval(() => {
        if (counter == 0) {
          this.getCaptcha()
          this.setState({ counter: 60 })
          clearInterval(timer)
        } else {
          this.setState({ 
            counter: counter - 1 
          })
        }
      }, 1000)
    } catch (err) {
      Taro.showToast({ title: err.msg, icon: 'none' })
      this.getCaptcha()
    }
  }


  render() {
    const {
      userInfo,
      handleAuth,
      userClick,
      memberInfo,
    } = this.props;
    const { panelYzmShow, phoneInput, codeInput, codeImg, yzmInput, sendSuccess , counter } = this.state
    return (
      <View>
        {
          (userClick && isEmptyObject(userInfo)) &&
          <View className="panel authorize">
            <View className="shadow"></View>
            <View className="panelContent" catchTouchMove="ture">
              {<View onClick={() => handleAuth(false)} className="closeBtn"><Image className="innerImg" src='https://cnshacc1oss01.oss-cn-shanghai.aliyuncs.com/frontend/assets/user/close.png' /></View>}
              <View class="content">
                {Env === 'ALIPAY' && <View class="title">支付宝授权</View>}
                {Env === 'WEAPP' && <View class="title">微信授权</View>}
                <View class="tit">Tims需要获取您的用户信息</View>
                <View className="flex-item confirmBtn">
                  {Env === 'ALIPAY' && <Button className="btn" scope="userInfo" open-type="getAuthorize" onClick={this.handleTrackConfirm.bind(this)} onGetAuthorize={this.confirmAuthrize.bind(this)}>确定</Button>}
                  {Env === 'WEAPP' && (canIUseGetUserProfile ? <Button className="btn" onClick={this.handleProfileAuthorize}>授权登录</Button> : <Button className="btn" open-type="getUserInfo" bindgetuserinfo={this.confirmAuthrize.bind(this)}>{commonIcon}授权登录</Button>)}
                </View>
              </View>
            </View>
          </View>
        }
        {
          (userClick && !isEmptyObject(userInfo) && isEmptyObject(memberInfo)) && <View class="panel panelRegister">
            <View className="shadow"></View>
            <View className="panelContent" catchtouchmove="ture">
              <View className="closeBtn" onClick={() => handleAuth(false)}><Image className="innerImg" src={('https://cnshacc1oss01.oss-cn-shanghai.aliyuncs.com/frontend/assets/user/close.png')} /></View>
              {/* <Image mode="widthFix" className="bgImg" src="http://cnshacc1oss01.oss-cn-shanghai.aliyuncs.com/tims15907416499790e3f0a0434298b50cd0b231c7cce0d7.png" /> */}
              <View class="content">
                {Env == "WEAPP" && <Button className="btn authorizeBtn" openType="getPhoneNumber" onGetPhoneNumber={this.phoneAuthorized}><Image className="wx" src={('https://cnshacc1oss01.oss-cn-shanghai.aliyuncs.com/frontend/assets/user/wx2.png')} />微信快速注册</Button>}
                {Env == "ALIPAY" && <Button className="btn authorizeBtn" scope='phoneNumber' openType="getAuthorize" onGetAuthorize={this.phoneAuthorized}>快速注册</Button>}
                <View onClick={this.openYzmRegister} className="phoneRegister">使用手机号注册 ></View>
              </View>
              <View className="reject" onClick={() => handleAuth(false)}>暂不登录</View>
            </View>
          </View>
        }

        {
          panelYzmShow &&
          <View class="panel panelYzm">
            <View className="shadow"></View>
            <View className="panelContent" catchTouchMove="ture">
              <View className="closeBtn" onClick={this.closeYzmPanel}><Image className="innerImg" src={('https://cnshacc1oss01.oss-cn-shanghai.aliyuncs.com/frontend/assets/user/close.png')} /></View>
              <View class="content">
                <View className="title">请绑定手机号</View>
                <View className="fmGroup hasBtn">
                  <Input type="number" maxlength="11" onInput={this.handleInput('phoneInput')} value={phoneInput} placeholder="请输入手机号" enableNative={true} controlled={true} />
                </View>
                <View className="fmGroup hasBtn">
                  <Input type="text" maxlength="4" onInput={this.handleInput('codeInput')} value={codeInput} placeholder="请输入图形验证码" enableNative={true} controlled={true} />
                  <Image className="captcha" src={codeImg} onClick={this.getCaptcha} /></View>
                <View className="fmGroup hasBtn">
                  <Input type="number" maxlength="6" onInput={this.handleInput('yzmInput')} value={yzmInput} placeholder="请输入短信验证码" enableNative={true} controlled={true} />
                  <Button disabled={(phoneInput.length == 11 && codeInput.length == 4) ? false : true} className={`sendBtn ${phoneInput.length == 11 && codeInput.length == 4 ? 'active' : ''}`} onClick={this.sendCode}>{timer ? counter + '秒后重试' : '获取验证码'}</Button>
                </View>
                <View className="confirmbtn" onClick={this.subimitFun}>确定</View>
              </View>
            </View>
          </View>
        }
        <AtMessage />
      </View>
    )
  }
}

export default Authorize