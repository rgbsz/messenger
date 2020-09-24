import { REQUEST_STATUS } from "../global.consts"

export type userContextTypes = {
  uid: null | string
  fullname: null | string
  email: null | string
  requestStatus: REQUEST_STATUS
}
