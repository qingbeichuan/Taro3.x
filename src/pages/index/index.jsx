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
  checkAuthStatus(bool) {
    dispatch(checkAuthStatus(bool))
  }
}))
class Index extends Component {
  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  async componentDidShow () {
    await this.props.checkAuthStatus()
    if (this.props.isAuthorized) {
      this.getInitData()
    }
  }

  getInitData = async () => {
    try {
      const res = await Api.getGiftCardListCount()
    } catch (error) {
      console.log(error);
    }

    try {
      const res = await Api.getCouponList({
        checkShop: 0
      })
    } catch (error) {
      console.log(error);
    }

    try {
      const res = await Api.getRightsList({
        levelId: 1,
      })
    } catch (error) {
      console.log(error);
    }
  }

  componentDidHide () { }

  add = async () => {
    console.log(this.props.isAuthorized);
    await this.props.checkAuthStatus(true)
    if (this.props.isAuthorized) {
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
        <Authorize onUpdate={this.getInitData}/>
      </View>
    )
  }
}

export default Index

