import React, { useEffect } from "react"
import firebase from "./firebase"

function App() {
  useEffect(() => {
    const query = async () => {
      const db = firebase.firestore()
      const data = await db
        .collection("users")
        .where("firstname", "==", "Rafał")
        .get()
      const users = data.forEach((user: any) => console.log(user.data()))
    }
    query()
  }, [])
  return <>Hello world</>
}

export default App
