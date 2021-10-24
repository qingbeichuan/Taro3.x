import React, { useEffect } from 'react'
import { View, Button } from '@tarojs/components'
import { getCurrentInstance } from '@tarojs/taro'
import NavBar from '@/components/navBar' 
import {
  useReady,
  useDidShow,
  useDidHide,
  usePullDownRefresh
} from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { add, minus, asyncAdd } from '@/actions/counter'


function Index () {
  const { router } = getCurrentInstance()
  const counter = useSelector(state => state.counter)
  const dispatch = useDispatch()
  console.log(counter);
  // 可以使用所有的 React Hooks
  useEffect(() => {})

  // 对应 onReady
  useReady(() => {})

  // 对应 onShow
  useDidShow(() => {})

  // 对应 onHide
  useDidHide(() => {})

  // Taro 对所有小程序页面生命周期都实现了对应的自定义 React Hooks 进行支持
  // 详情可查阅：【Hooks】
  usePullDownRefresh(() => {})

  const handleAdd = () => {
    dispatch(add())
  }

  return (
    <View>
      <NavBar></NavBar>
      <Button className='add_btn' onClick={handleAdd}>+</Button>
      {counter.num}
    </View>
  )
}

export default Index