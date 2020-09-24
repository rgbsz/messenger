import React, { useEffect, useState } from "react"
import firebase from "../firebase"

import { userContextTypes } from "./auth.types"
import { REQUEST_STATUS } from "../global.consts"

export const AuthContext = React.createContext<userContextTypes>({
  uid: null,
  email: null,
  fullname: null,
  requestStatus: REQUEST_STATUS.NONE
})

const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<userContextTypes>({
    uid: null,
    email: null,
    fullname: null,
    requestStatus: REQUEST_STATUS.NONE
  })
  useEffect(() => {
    setUser({ uid: null, email: null, fullname: null, requestStatus: REQUEST_STATUS.PENDING })
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        while (true) {
          const query = firebase
            .firestore()
            .collection("users")
            .doc(user.uid).get()
          const res = await query
          if (res.data()) {
            setUser({ uid: res.id, email: res.data()?.email, fullname: res.data()?.fullname, requestStatus: REQUEST_STATUS.SUCCESS })
            break
          }
        }
      } else setUser({ uid: null, email: null, fullname: null, requestStatus: REQUEST_STATUS.FAILED })
    })
  }, [])
  return (
    <AuthContext.Provider value={{ ...user }}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider
