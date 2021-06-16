import Taro from '@tarojs/taro'
import { Component } from 'react'
import { connect } from 'react-redux'
import { View, Button, Image } from '@tarojs/components'
import { cancelAuth } from '@/actions/global'
import { storage } from '@/utils/tools'
import './index.scss'

const Env = Taro.getEnv();
const canIUseGetUserProfile = Env === 'WEAPP' ? !!wx.getUserProfile : false;

@connect(({ global }) => ({
  isAuthorized: global.isAuthorized
}), (dispatch) => ({
  cancelAuth(status) {
    dispatch(cancelAuth(status))
  }
}))
class Authorize extends Component {
  static defaultProps = {
    showCancel: true
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
        this.props.cancelAuth(true)
      },
      fail: () => {
        console.log('拒绝授权')
      }
    })
  }

  cancelAuthorize = () => {
    this.props.cancelAuth(true)
  }

  render() {
    const { isAuthorized, cancelAuthorize, showCancel } = this.props;

    const commonIcon = <Image className="wx" src={'https://cnshacc1oss01.oss-cn-shanghai.aliyuncs.com/frontend/assets/user/wx2.png'} />
    return (
      <View>
        { 
          !isAuthorized ?
            <View className="panel authorize">
              <View className="shadow"></View>
              <View className="panelContent" catchTouchMove="ture">
                {showCancel ? <View onClick={this.cancelAuthorize} className="closeBtn"><Image className="innerImg" src='https://cnshacc1oss01.oss-cn-shanghai.aliyuncs.com/frontend/assets/user/close.png'/></View> : null}
                <Image mode="widthFix" className="centerImg" src='https://cnshacc1oss01.oss-cn-shanghai.aliyuncs.com/frontend/authorize.jpg' />
                <View class="content">
                  {Env === 'ALIPAY' && <View class="title">支付宝授权</View>}
                  {Env === 'WEAPP' && <View class="title">微信授权</View>}
                  <View class="tit">Tims需要获取您的用户信息</View>
                  <View className="flex-item confirmBtn">
                    {Env === 'ALIPAY' && <Button className="btn" scope="userInfo" open-type="getAuthorize" onClick={this.handleTrackConfirm.bind(this)} onGetAuthorize={this.confirmAuthrize.bind(this)}>确定</Button>}
                    {Env === 'WEAPP' && (canIUseGetUserProfile ?  <Button className="btn"  onClick={this.handleProfileAuthorize}>{commonIcon}授权登录</Button> : <Button className="btn" open-type="getUserInfo" bindgetuserinfo={this.confirmAuthrize.bind(this)}>{commonIcon}授权登录</Button>)}
                  </View>
                </View>
              </View>
            </View> : null
          }
      </View>
    )
  }
}

export default Authorize