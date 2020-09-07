import React, { useEffect, useState } from "react"
import firebase from "../firebase"

import { userContextTypes } from "./auth.types"
import {REQUEST_STATUS} from "../global.consts"

export const AuthContext = React.createContext<userContextTypes>({
  uid: null,
  fullname: null,
  requestStatus: REQUEST_STATUS.NONE
})

const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<userContextTypes>({
    uid: null,
    fullname: null,
    requestStatus: REQUEST_STATUS.NONE
  })
  useEffect(() => {
    setUser({uid: null, fullname: null, requestStatus: REQUEST_STATUS.PENDING})
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .get()
            .then(snapshotUser =>
                setUser({
                  uid: snapshotUser.id,
                  fullname: `${snapshotUser.data()?.firstname} ${
                      snapshotUser.data()?.lastname
                  }`,
                  requestStatus: REQUEST_STATUS.SUCCESS
                })
            )
      } else setUser({ uid: null, fullname: null, requestStatus: REQUEST_STATUS.FAILED })
    })
  }, [])
  return (
      <AuthContext.Provider value={{ ...user }}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider
