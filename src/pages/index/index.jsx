import { Component } from 'react'
import { connect } from 'react-redux'
import { View, Button, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'

import { add, minus, asyncAdd } from '../../actions/counter'

import * as Api from '@/api/index'

import './index.scss'


@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add () {
    dispatch(add())
  },
  dec () {
    dispatch(minus())
  },
  asyncAdd () {
    dispatch(asyncAdd())
  }
}))
class Index extends Component {
  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  async componentDidShow () {
    try {
      const res = await Api.getGiftCardListCount({data: {
        version: '2.8.24',
        channel: 6,
        openid: 'oj0FH41tNgZGkYvtdkFwl78a1t3E',
        token: Taro.getStorageSync('token'),
        userId: 3152963
      }})
    } catch (error) {
      console.log(error);
    }

    try {
      const res = await Api.getCouponList({data: {
        version: '2.8.24',
        channel: 6,
        openid: 'oj0FH41tNgZGkYvtdkFwl78a1t3E',
        token: Taro.getStorageSync('token'),
        userId: 3152963,
        checkShop: 0
      }})
    } catch (error) {
      console.log(error);
    }

    try {
      const res = await Api.getRightsList({data: {
        version: '2.8.24',
        channel: 6,
        openid: 'oj0FH41tNgZGkYvtdkFwl78a1t3E',
        token: Taro.getStorageSync('token'),
        userId: 3152963,
        levelId: 1,
        merId: 31
      }})
    } catch (error) {
      console.log(error);
    }
  }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Button className='add_btn' onClick={this.props.add}>+</Button>
        <Button className='dec_btn' onClick={this.props.dec}>-</Button>
        <Button className='dec_btn' onClick={this.props.asyncAdd}>async</Button>
        <View><Text>{this.props.counter.num}</Text></View>
        <View><Text>Hello, World</Text></View>
      </View>
    )
  }
}

export default Index

