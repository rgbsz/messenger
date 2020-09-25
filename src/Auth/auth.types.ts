import { REQUEST_STATUS } from "../global.consts"

export type inviteTypes = {
  uid: string,
  fullname: string
}

export type userContextTypes = {
  uid: null | string
  fullname: null | string
  email: null | string
  invites: null | inviteTypes[]
  requestStatus: REQUEST_STATUS
}
