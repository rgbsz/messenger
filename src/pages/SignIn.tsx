import React, { useState, useEffect, useContext } from "react"
import styled from "styled-components"
import history from "../history"
import firebase from "../firebase"
import { AuthContext } from "../auth"

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<any>(null)
  const [password, setPassword] = useState<any>(null)
  const handleSubmit = (e: any) => {
    e.preventDefault()
    firebase.auth().signInWithEmailAndPassword(email, password)
  }
  const handleSignOut = () => {}
  const user = useContext(AuthContext)
  return (
    <Wrapper>
      <form onSubmit={(e: any) => handleSubmit(e)}>
        <input type='text' onInput={(e: any) => setEmail(e.target.value)} />
        <input
          type='password'
          onInput={(e: any) => setPassword(e.target.value)}
        />
        <input type='submit' />
      </form>
      <button onClick={() => handleSignOut()}>d</button>
    </Wrapper>
  )
}

const Wrapper = styled.div``

export default SignIn
