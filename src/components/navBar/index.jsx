import Taro from '@tarojs/taro'
import { Component } from 'react'
import { Text, View, Image } from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'

const Env = Taro.getEnv();
class NavBar extends Component {
  static defaultProps = {
    title: "",
    showBack: true,
    back: Function,
    background: "#fff",
    m_page: false
  };

  state = {
    statusBarHeight: 20,
    navBarHeight: ''
  };

  componentWillMount() {
    const info = Taro.getSystemInfoSync();
    this.setState({
      statusBarHeight: info.statusBarHeight || 0
    });
    this.calcNavbarHeight()
  }

  calcNavbarHeight() {
    const { height, top } = Taro.getMenuButtonBoundingClientRect();
    const { statusBarHeight, system } = Taro.getSystemInfoSync();
    const navBarHeight = (top - statusBarHeight) * 2 + height
    const addHeight = system.indexOf("iOS") === -1 ? 12 : 8;
    this.setState({
      navBarHeight
    })
  }
  
  render() {
    const { statusBarHeight, navBarHeight } = this.state;
    const { inDetail } = this.props;

    return (
      <View>
        { Env == "ALIPAY" && this.props.m_page ? '' :
          <View
            className={classNames("nav-bar-wrap", { "bar-in-detail": inDetail })}
            style={{
              paddingTop: `${statusBarHeight}px`,
              background: this.props.background,
              color: this.props.color
            }}
          >
            <View
              className={`nav-bar class-name ${this.props.className || ""}`}
              style={{
                height: `${navBarHeight}px`,
                lineHeight: `${navBarHeight}px`
              }}
            >
              {/* 导航栏左侧内容 */}
              {this.props.showBack ? (
                Env == "WEAPP" && (
                  <View
                    className={this.props.m_page ? 'nav-bar-left' : 'nbfwx'}
                    onClick={this.props.back.bind(this)}
                    style={{
                      top: this.props.m_page ? `0` : `${statusBarHeight}px`
                    }}
                  >
                    <View
                      className={classNames("at-icon", "at-icon-chevron-left", {
                        white:
                          this.props.background === "#000" ||
                          this.props.color === "#fff"
                      })}
                    />
                  </View>
                )
              ) : (
                  <View className="nav-bar-left">
                    {this.props.m_page ? (
                      <View>
                        {this.props.showIndex ? (
                          <Image
                            onClick={this.props.back.bind(this)}
                            className="nav-index"
                            src={(__STATIC_URL__+"/user/back.png")}
                          />
                        ) : null}
                      </View>
                    ) : (
                        <Image
                          className="nav-top"
                          src={(__STATIC_URL__+"/top.png")}
                        />
                      )}
                  </View>
                )}
              {/* 导航栏中间内容 */}
              <View className="nav-bar-title">
                <Text className="title">{this.props.title}</Text>
              </View>
            </View>
          </View>
        }
      </View>
    );
  }
}

export default NavBar;
