import React, { useEffect, useState } from "react"
import { User } from "firebase"
import firebase from "./firebase"

export const AuthContext = React.createContext<{
  uid: string | null
  fullname: string | null
}>({ uid: null, fullname: null })

const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<{
    uid: null | string
    fullname: null | string
  }>({ uid: null, fullname: null })
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
