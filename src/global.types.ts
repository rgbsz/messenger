export type chatUserTypes = {
  uid: string
  fullname: string
}

export type chatMessageTypes = {
  author: string
  content: string
}

export type chatTypes = {
  id: string
  user: chatUserTypes
  messages: chatMessageTypes[]
}
