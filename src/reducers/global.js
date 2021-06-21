import { 
  CHECK_AUTH_STATUS,
  HANDLE_AUTH,
  GET_MEMBER_INFO
 } from '../constants/global'
 import { storage } from '@/utils/tools'

const INITIAL_STATE = {
  userInfo: storage.get('userInfo') || {},
  userClick: false,
  memberInfo: storage.get('memberInfo') || {},
}

export default function global(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CHECK_AUTH_STATUS:
      return {
        ...state,
        ...action.payload
      }
    case HANDLE_AUTH:
      return {
        ...state,
        ...action.payload
      }
    case GET_MEMBER_INFO:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
