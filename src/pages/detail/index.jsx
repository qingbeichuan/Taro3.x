import { Component } from 'react'
import { connect } from 'react-redux'
import { View, Button, Text } from '@tarojs/components'
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
class Detail extends Component {
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='container'>
        <NavBar></NavBar>
        <View className="main">
          <Button className='add_btn' onClick={this.props.add}>menu</Button>
          <View><Text>{this.props.counter.num}</Text></View>
          <View><Text>Hello, World</Text></View>
        </View>
      </View>
    )
  }
}

export default Detail

