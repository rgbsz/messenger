import React, { useState } from "react"
import styled from "styled-components"
import firebase from "../firebase"

import { emailTypes, passwordTypes } from "./SignIn.types"

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<emailTypes>(null)
  const [password, setPassword] = useState<passwordTypes>(null)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (email && password)
      firebase.auth().signInWithEmailAndPassword(email, password).then(() => console.log('logged in')).catch(() => console.log('error'))
  }
  return (
    <Wrapper>
      <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
        <input
          type='text'
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
        <input
          type='password'
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
        <input type='submit' />
      </form>
    </Wrapper>
  )
}

const Wrapper = styled.div``

export default SignIn
