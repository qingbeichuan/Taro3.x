import {
  CHECK_AUTH_STATUS
} from '../constants/global'
import { storage } from '@/utils/tools'

export const minus = () => {
  return {
    type: CHECK_AUTH_STATUS,
    payload: {
      isAuthorized: !!storage.get('isAuthorized')
    }
  }
}

export const checkAuthStatus = () => {
  return async dispatch => {
    dispatch(minus())
  }
}