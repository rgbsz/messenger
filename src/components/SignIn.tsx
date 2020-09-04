import React, { useState, useEffect } from "react"
import styled from "styled-components"
import history from "../history"
import firebase from "../firebase"

const SignIn: React.FC = () => {
  const [userName, setUserName] = useState<any>(null)
  const [password, setPassword] = useState<any>(null)
  const db = firebase.firestore()
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const query = await db
      .collection("users")
      .where("username", "==", userName)
      .get()
    if (query.empty) {
      alert("wrong username")
    } else {
      if (password !== query.docs[0].data().password) alert("wrong password")
      else {
        localStorage.setItem("uid", query.docs[0].id)
        history.push("/chat")
      }
    }
  }
  return (
    <Wrapper>
      <form onSubmit={(e: any) => handleSubmit(e)}>
        <input type='text' onInput={(e: any) => setUserName(e.target.value)} />
        <input
          type='password'
          onInput={(e: any) => setPassword(e.target.value)}
        />
        <input type='submit' />
      </form>
    </Wrapper>
  )
}

const Wrapper = styled.div``

export default SignIn
