import { Component } from 'react'
import { connect } from 'react-redux'
import { View, Button, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NavBar from '@/components/navBar' 
import { add, minus, asyncAdd } from '../../actions/counter'
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
class Menu extends Component {
  state = {
    res: {}
  }
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  onReady () {
  }

  componentDidHide () { }


  render () {
    return (
      <View className='container'>
        <NavBar></NavBar>
        <View className="main">
          <View className="shoppingCart">购车车</View>
          {
            [1,2,3,4,5,6].map((item) => {
              return (
                <View className="product">
                  <View className="item" onClick={this.addCart}>商品{item}</View>
                </View>
              )
            })
          }
        </View>
      </View>
    )
  }
}

export default Menu

