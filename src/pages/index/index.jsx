import { Component } from 'react'
import { connect } from 'react-redux'
import { View, Button, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Authorize from '@/components/authorize'
import NavBar from '@/components/navBar' 
import { add, minus, asyncAdd } from '@/actions/counter'
import { handleAuth } from '@/actions/global'
import { isEmptyObject } from '@/utils/tools'

import * as Api from '@/api/index'

import './index.scss'


@connect(({ global, counter }) => ({
  userInfo: global.userInfo,
  memberInfo: global.memberInfo,
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
  handleAuth(bool) {
    dispatch(handleAuth(bool))
  }
}))
class Index extends Component {
  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  async componentDidShow () {
    // await this.props.checkAuthStatus()
    if (!isEmptyObject(this.props.memberInfo)) {
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
    await this.props.handleAuth(true)
    if (!isEmptyObject(this.props.userInfo)) {
      this.props.add()
    }
  }

  render () {
    return (
      <View className='container'>
        <NavBar></NavBar>
        <View>
          <Button className='add_btn' onClick={this.add}>+</Button>
          <Button className='dec_btn' onClick={this.props.dec}>-</Button>
          <Button className='dec_btn' onClick={this.props.asyncAdd}>async</Button>
          <View><Text>{this.props.counter.num}</Text></View>
          <View><Text>Hello, World</Text></View>
          <Authorize onUpdate={this.getInitData}/>
          <View>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi fugit ea cumque maiores iure at? Porro tenetur eius alias minus. Laudantium est architecto ad mollitia voluptates necessitatibus qui voluptas blanditiis?</View>
          <View>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi fugit ea cumque maiores iure at? Porro tenetur eius alias minus. Laudantium est architecto ad mollitia voluptates necessitatibus qui voluptas blanditiis?</View>
          <View>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi fugit ea cumque maiores iure at? Porro tenetur eius alias minus. Laudantium est architecto ad mollitia voluptates necessitatibus qui voluptas blanditiis?</View>
          <View>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi fugit ea cumque maiores iure at? Porro tenetur eius alias minus. Laudantium est architecto ad mollitia voluptates necessitatibus qui voluptas blanditiis?</View>
          <View>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi fugit ea cumque maiores iure at? Porro tenetur eius alias minus. Laudantium est architecto ad mollitia voluptates necessitatibus qui voluptas blanditiis?</View>
          <View>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi fugit ea cumque maiores iure at? Porro tenetur eius alias minus. Laudantium est architecto ad mollitia voluptates necessitatibus qui voluptas blanditiis?</View><View>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi fugit ea cumque maiores iure at? Porro tenetur eius alias minus. Laudantium est architecto ad mollitia voluptates necessitatibus qui voluptas blanditiis?</View><View>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi fugit ea cumque maiores iure at? Porro tenetur eius alias minus. Laudantium est architecto ad mollitia voluptates necessitatibus qui voluptas blanditiis?</View><View>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi fugit ea cumque maiores iure at? Porro tenetur eius alias minus. Laudantium est architecto ad mollitia voluptates necessitatibus qui voluptas blanditiis?</View>
        </View>
      </View>
    )
  }
}

export default Index

