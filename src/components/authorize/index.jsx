import Taro from '@tarojs/taro'
import { Component } from 'react'
import { connect } from 'react-redux'
import { View, Button, Image, Text } from '@tarojs/components'
import { handleAuth, getMemberInfo } from '@/actions/global'
import { storage } from '@/utils/tools'
import * as Api from '@/api/index'
import { isEmptyObject } from '@/utils/tools'
import './index.scss'

const Env = Taro.getEnv();
const canIUseGetUserProfile = Env === 'WEAPP' ? !!wx.getUserProfile : false;

@connect(({ global }) => ({
  userInfo: global.userInfo,
  userClick: global.userClick,
  memberInfo: global.memberInfo
}), (dispatch) => ({
  handleAuth(status) {
    dispatch(handleAuth(status))
  },
  getMemberInfo(name) {
    dispatch(getMemberInfo(name))
  }
}))
class Authorize extends Component {
  static props = {
    onUpdate: () => { }
  }
  state = {
    memberInfo: storage.get('memberInfo') || {},
    isShowRegieterPanel: false
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
        this.props.handleAuth(true)
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
          this.props.getMemberInfo(name)
        } catch (err) {
          // log.error('调用jsCode2Openid失败,'+JSON.stringify(err));
          console.log(err);
        }
      },
      fail: (err) => {
        log.error('wx.login超时,' + JSON.stringify(err));
      }
    })
  }

  closePanelRegister() {
    this.setState({
      panelRegisterShow:
        false
    });
  }

  checkAgree() {
    this.setState({ agree: !this.state.agree })
  }

  openProtocol(e) {
    e.stopPropagation();
    // let url = base.micvsDomain + 'tim-weixin/wechat/page/protocol'
    // Taro.navigateTo({ url: '/pages/m_webview/index?url=' + url })
  }

  phoneAuthorized(res) {
    if (!this.state.agree) {
      this.setState({ panelTipShow: true, tipMsg: '请阅读并同意用户协议' })
      return;
    }
    if (Env == "WEAPP") {
      const { encryptedData, iv } = res.detail;
      if (encryptedData) {
        Api.encryptedData({
          encryptedData,
          iv
        }).then((res) => {
          const mobile = res.purePhoneNumber;
          this.mobileNext(mobile);
        }).catch((err) => {
          Taro.showModal({ content: '获取手机号失败', showCancel: false })
        })
      }
    } else if (Env == "ALIPAY") {
      my.getPhoneNumber({
        success: (res) => {
          const { response, sign } = JSON.parse(res.response);
          Api.encryptedData(response, sign).then((res) => {
            const { mobile } = JSON.parse(res.data);
            if (mobile) {
              isFormPhonenumberCompleteRegister = true
              this.mobileNext(mobile);
            } else {
              this.$sa.authorize_phonenumber({
                is_success: false,
                fail_reason: '获取手机号失败'
              })
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

  mobileNext(mobile) {
    Api.fetchUserInfo({mobile}, {errToast: false}).then((res) => {
      // Api.userLogin({
      //   name: storage.get('userInfo').nickName, 
      //   idType:5, 
      //   amount: mobile,
      // }).then(res => {
      //   console.log('=====登录成功=====');
      //   this.setState({ panelYzmShow: false })
      // }).catch(err => {
      //   return Promise.reject(err);
      // });
    }).catch((err) => {
      console.log(err)
      if (err.errcode == 100124) {
        let { userInfo: { gender, birth = '', avatarUrl } } = this.props;
        if (Env=="ALIPAY") gender = gender == 'm' ? 1 : 0;
        const shopId = Taro.getStorageSync('shopId');
        Api.userRegister({ 
          mobile, gender, birth, shopId,
          acceptPic: avatarUrl
        }).then(res => {
          console.log('=====注册成功=====');
          this.props.getMemberInfo()
        }).catch(err => {
          console.log(err)
        })
      }
    })
  }


  openYzmRegister() {
    if (!this.state.agree) {
      this.setState({ panelTipShow: true, tipMsg: '请阅读并同意用户协议' })
      return;
    }
    this.$sa.click_phonenumber_register()
    this.getCaptcha();
    this.setState({ panelYzmShow: true })
  }


  render() {
    const { userInfo, handleAuth, userClick, memberInfo } = this.props;
    const { agree } = this.state

    const commonIcon = <Image className="wx" src={'https://cnshacc1oss01.oss-cn-shanghai.aliyuncs.com/frontend/assets/user/wx2.png'} />
    return (
      <View>
        {
          (userClick && isEmptyObject(userInfo)) &&
          <View className="panel authorize">
            <View className="shadow"></View>
            <View className="panelContent" catchTouchMove="ture">
              {<View onClick={() => handleAuth(false)} className="closeBtn"><Image className="innerImg" src='https://cnshacc1oss01.oss-cn-shanghai.aliyuncs.com/frontend/assets/user/close.png' /></View>}
              <Image mode="widthFix" className="centerImg" src='https://cnshacc1oss01.oss-cn-shanghai.aliyuncs.com/frontend/authorize.jpg' />
              <View class="content">
                {Env === 'ALIPAY' && <View class="title">支付宝授权</View>}
                {Env === 'WEAPP' && <View class="title">微信授权</View>}
                <View class="tit">Tims需要获取您的用户信息</View>
                <View className="flex-item confirmBtn">
                  {Env === 'ALIPAY' && <Button className="btn" scope="userInfo" open-type="getAuthorize" onClick={this.handleTrackConfirm.bind(this)} onGetAuthorize={this.confirmAuthrize.bind(this)}>确定</Button>}
                  {Env === 'WEAPP' && (canIUseGetUserProfile ? <Button className="btn" onClick={this.handleProfileAuthorize}>{commonIcon}授权登录</Button> : <Button className="btn" open-type="getUserInfo" bindgetuserinfo={this.confirmAuthrize.bind(this)}>{commonIcon}授权登录</Button>)}
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
              <Image mode="widthFix" className="bgImg" src="http://cnshacc1oss01.oss-cn-shanghai.aliyuncs.com/tims15907416499790e3f0a0434298b50cd0b231c7cce0d7.png" />
              <View class="content">
                <View className="protocol" onClick={this.checkAgree.bind(this)}>
                  {agree ? <Image className="yes" src={('https://cnshacc1oss01.oss-cn-shanghai.aliyuncs.com/frontend/assets/select.png')} /> : <Image className="yes" src={('https://cnshacc1oss01.oss-cn-shanghai.aliyuncs.com/frontend/assets/select-un.png')} />}
                  我已阅读并同意<Text onClick={this.openProtocol.bind(this)}>《用户协议》</Text>
                </View>
                {Env == "WEAPP" && <Button className="btn authorizeBtn" openType="getPhoneNumber" onGetPhoneNumber={this.phoneAuthorized.bind(this)}><Image className="wx" src={('https://cnshacc1oss01.oss-cn-shanghai.aliyuncs.com/frontend/assets/user/wx2.png')} />微信快速注册</Button>}
                {Env == "ALIPAY" && <Button className="btn authorizeBtn" scope='phoneNumber' openType="getAuthorize" onGetAuthorize={this.phoneAuthorized.bind(this)}>快速注册</Button>}
                <View onClick={this.openYzmRegister.bind(this)} className="phoneRegister">使用手机号注册 ></View>
              </View>
              <View className="reject" onClick={this.closePanelRegister.bind(this)}>暂不登录</View>
            </View>
          </View>
        }
      </View>
    )
  }
}

export default Authorize