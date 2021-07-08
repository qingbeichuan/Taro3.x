import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import React, { useState, useEffect } from 'react'
import { AtIcon } from 'taro-ui'
import appConfig from '../../app.config'
import './index.scss'

const Env = Taro.getEnv();
// class NavBar extends Component {
//   static defaultProps = {
//     title: "首页",
//     background: "#fff",
//     color: "#333"
//   };

//   state = {
//     statusBarHeight: 0,
//     navBarHeight: 0
//   };

//   componentWillMount() {
//     this.calcNavbarHeight()
//   }

//   componentDidMount () {
//     const pages = Taro.getCurrentPages()
//     const isIndex = pages.length == 1
//     const { route } = pages[pages.length - 1]
//     const isShowIcon = config.pages.includes(route)
//     console.log(isShowIcon)
//     this.setState({
//       isIndex,
//       isShowIcon
//     })
//   }

//   calcNavbarHeight() {
//     const { height, top } = Taro.getMenuButtonBoundingClientRect();
//     const { statusBarHeight } = Taro.getSystemInfoSync();
//     const navBarHeight = (top - statusBarHeight) * 2 + height
//     this.setState({
//       navBarHeight,
//       statusBarHeight
//     })
//   }

//   handleBack = () => {
//     const { isIndex } = this.state
//     if (isIndex) {
//       Taro.reLaunch({
//         url: '/pages/index/index'
//       })
//     } else {
//       Taro.navigateBack()
//     }
//   }

//   render() {
//     const { statusBarHeight, navBarHeight, isIndex, isShowIcon } = this.state;
//     const { background, color, inDetail, title } = this.props;

//     return (
//       <View>
//         { 
//           Env == "ALIPAY" ? (
//             null
//           ) : (
//             <View
//               style={{
//                 paddingTop: `${statusBarHeight}px`,
//                 background,
//                 color,
//                 height: navBarHeight,
//                 lineHeight: `${navBarHeight}px`
//               }}
//             >
//               {
//                 !isShowIcon &&
//                 <View 
//                   className="navBarIcon" 
//                   style={{
//                     height: navBarHeight,
//                     width: navBarHeight,
//                   }}
//                   onClick={this.handleBack}
//                 >
//                   {
//                     isIndex ? (
//                       <AtIcon value='home' size='20' color={color}></AtIcon>
//                     ) : (
//                       <AtIcon value='chevron-left' size='26' color={color}></AtIcon>
//                     )
//                   }
//                 </View>
//               }
//               <View className="navBarTitle">{title}</View>
//             </View>
//           )
//         }
//       </View>
//     );
//   }
// }

export default function NavBar({ background, color }) {
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const [navBarHeight, setNavBarHeight] = useState(0);
  const [isIndex, setIsIndex] = useState(false);//当前页页面栈是否为第一
  const [isShowIcon, setIsShowIcon] = useState(false);//tabbar页面不展示返回icon
  const [title, setTitle] = useState();

  useEffect(() => {
    getPageInfo()
    calcNavbarHeight()
  }, [])

  function getPageInfo() {
    const pages = Taro.getCurrentPages()
    const isIndex = pages.length == 1
    const { route, config: { navigationBarTitleText: title } } = pages[pages.length - 1]
    const isShowIcon = appConfig.pages.includes(route)
    setIsIndex(isIndex)
    setIsShowIcon(isShowIcon)
    setTitle(title)
  }

  function calcNavbarHeight() {
    const { height, top } = Taro.getMenuButtonBoundingClientRect();
    const { statusBarHeight } = Taro.getSystemInfoSync();
    const navBarHeight = (top - statusBarHeight) * 2 + height
    setStatusBarHeight(statusBarHeight)
    setNavBarHeight(navBarHeight)
  }

  function handleBack() {
    if (isIndex) {
      Taro.reLaunch({
        url: '/pages/index/index'
      })
    } else {
      Taro.navigateBack()
    }
  }
  return (
    <View>
      {
        Env == "ALIPAY" ? (
          null
        ) : (
          <View
            className="navBarBox"
            style={{
              paddingTop: `${statusBarHeight}px`,
              background,
              color,
              height: `${navBarHeight}px`,
              lineHeight: `${navBarHeight}px`
            }}
          >
            {
              !isShowIcon &&
              <View
                className="navBarIcon"
                style={{
                  height: navBarHeight,
                  width: navBarHeight,
                }}
                onClick={handleBack}
              >
                {
                  isIndex ? (
                    <AtIcon value='home' size='20' color={color}></AtIcon>
                  ) : (
                    <AtIcon value='chevron-left' size='22' color={color}></AtIcon>
                  )
                }
              </View>
            }
            <View className="navBarTitle">{title}</View>
          </View>
        )
      }
    </View>
  );
}

NavBar.defaultProps = {
  background: "#fff",
  color: "#333"
};