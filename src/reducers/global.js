import { 
  CHECK_AUTH_STATUS,
  HANDLE_AUTH,
  GET_MEMBER_INFO,
  UPDATE_TOKRN
 } from '../constants/global'
 import { storage } from '@/utils/tools'

const INITIAL_STATE = {
  isAuthorized: true,
  userClick: false,
  memberInfo: storage.get('memberInfo') || {},
  token: storage.get('token') 
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
    case UPDATE_TOKRN:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
