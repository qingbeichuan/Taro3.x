import { Component } from 'react'
import { connect } from 'react-redux'
import { View, Button, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NavBar from '@/components/navBar' 
import { add, minus, asyncAdd } from '../../actions/counter'
import Parabola from '@/utils/parabola'
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
    parabola: {},
    res: {}
  }
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  onReady () {
    this.getRect()
  }

  componentDidHide () { }

  addCart = (e) => {
    const { target } = this.state
    console.log('e', e);
    let parabola = new Parabola({
      origin: e.detail,
      target: target,
      element: '.move',
      callback: (res) => {
        // console.log(res);
        this.setState({
          res
        })
      }
    });
    // console.log(parabola)
    this.setState({
      parabola
    }, () => {
      parabola.move()
    })
  }

  getRect() {
    Taro.createSelectorQuery().select('.shoppingCart').boundingClientRect((rect) => {
      console.log(rect);
      this.setState({
        target: rect
      })
    }).exec()
  }

  render () {
    const { parabola, res } = this.state
    console.log(parabola);
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
          <View 
            className="move"
            style={{
              left: parabola.originX,
              top: parabola.originY,
              transform: 'translate(' + (res.x || 0) + 'px,' + (res.y || 0) + 'px)'
            }}
          ></View>
        </View>
      </View>
    )
  }
}

export default Menu

