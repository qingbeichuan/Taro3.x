import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtMessage } from 'taro-ui'
import './index.scss'


export const message = (props) => {
  useEffect(() => {
    props.message && Taro.atMessage(props)
  });
  return (
    <View>
      <AtMessage />
    </View>
  )
}