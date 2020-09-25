import React, { useEffect, useState } from "react"
import firebase from "../firebase"

import { userContextTypes } from "./auth.types"
import { REQUEST_STATUS } from "../global.consts"

export const AuthContext = React.createContext<userContextTypes>({
  uid: null,
  email: null,
  fullname: null,
  invites: null,
  requestStatus: REQUEST_STATUS.NONE
})

const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<userContextTypes>({
    uid: null,
    email: null,
    fullname: null,
    invites: null,
    requestStatus: REQUEST_STATUS.NONE
  })
  useEffect(() => {
    setUser({ uid: null, email: null, fullname: null, invites: null, requestStatus: REQUEST_STATUS.PENDING })
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        firebase.firestore().collection('users').doc(user.uid).onSnapshot((snapshot) => {
          if (snapshot.data()) {
            setUser({ uid: snapshot.id, email: snapshot.data()?.email, fullname: snapshot.data()?.fullname, invites: snapshot.data()?.invites, requestStatus: REQUEST_STATUS.SUCCESS })
          }
        })
      } else setUser({ uid: null, email: null, fullname: null, invites: null, requestStatus: REQUEST_STATUS.FAILED })
    })
  }, [])
  useEffect(() => {

  }, [])
  return (
    <AuthContext.Provider value={{ ...user }}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider
