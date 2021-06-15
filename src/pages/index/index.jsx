import { Component } from 'react'
import { connect } from 'react-redux'
import { View, Button, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Authorize from '../../components/authorize' 
import { add, minus, asyncAdd } from '@/actions/counter'
import { checkAuthStatus } from '@/actions/global'

import * as Api from '@/api/index'

import './index.scss'


@connect(({ global, counter }) => ({
  isAuthorized: global.isAuthorized,
  counter
}), (dispatch) => ({
  add () {
    dispatch(add({
      payload: 123
    }))
  },
  dec () {
    dispatch(minus())
  },
  asyncAdd () {
    dispatch(asyncAdd())
  },
  checkAuthStatus() {
    dispatch(checkAuthStatus())
  }
}))
class Index extends Component {
  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  async componentDidShow () {
    try {
      const res = await Api.getGiftCardListCount({
        version: '2.8.24',
        channel: 6,
        openid: 'oj0FH41tNgZGkYvtdkFwl78a1t3E',
        token: Taro.getStorageSync('token'),
        userId: 3152963
      })
    } catch (error) {
      console.log(error);
    }

    try {
      const res = await Api.getCouponList({
        version: '2.8.24',
        channel: 6,
        openid: 'oj0FH41tNgZGkYvtdkFwl78a1t3E',
        token: Taro.getStorageSync('token'),
        userId: 3152963,
        checkShop: 0
      })
    } catch (error) {
      console.log(error);
    }

    try {
      const res = await Api.getRightsList({
        version: '2.8.24',
        channel: 6,
        openid: 'oj0FH41tNgZGkYvtdkFwl78a1t3E',
        token: Taro.getStorageSync('token'),
        userId: 3152963,
        levelId: 1,
        merId: 31
      })
    } catch (error) {
      console.log(error);
    }
  }

  componentDidHide () { }

  add = async () => {
    console.log(this.props.isAuthorized);
    await this.props.checkAuthStatus()
    if (this.props.isAuthorized) {
      console.log(123)
      this.props.add()
    }
  }

  render () {
    return (
      <View className='index'>
        <Button className='add_btn' onClick={this.add}>+</Button>
        <Button className='dec_btn' onClick={this.props.dec}>-</Button>
        <Button className='dec_btn' onClick={this.props.asyncAdd}>async</Button>
        <View><Text>{this.props.counter.num}</Text></View>
        <View><Text>Hello, World</Text></View>
        <Authorize />
      </View>
    )
  }
}

export default Index

