import {
  CHECK_AUTH_STATUS,
  CANCEL_AUTH,
} from '../constants/global'
import { storage } from '@/utils/tools'

export const checkStatus = () => {
  return {
    type: CHECK_AUTH_STATUS,
    payload: {
      isAuthorized: !!storage.get('userInfo')
    }
  }
}

export const checkAuthStatus = () => {
  return async dispatch => {
    dispatch(checkStatus())
  }
}

export const cancelAuth = (status) => {
  return {
    type: CANCEL_AUTH,
    payload: {
      isAuthorized: status
    }
  }
}