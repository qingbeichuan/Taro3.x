import { CHECK_AUTH_STATUS } from '../constants/global'

const INITIAL_STATE = {
  isAuthorized: true
}

export default function global(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CHECK_AUTH_STATUS:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
