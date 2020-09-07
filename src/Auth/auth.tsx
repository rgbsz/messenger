import React, { useEffect, useState } from "react"
import firebase from "../firebase"

import { userContextTypes } from "./auth.types"

export const AuthContext = React.createContext<userContextTypes>({
  uid: null,
  fullname: null,
})

const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<userContextTypes>({
    uid: null,
    fullname: null,
  })
  useEffect(() => {
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
            })
          )
      } else setUser({ uid: null, fullname: null })
    })
  }, [])
  return (
    <AuthContext.Provider value={{ ...user }}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider
