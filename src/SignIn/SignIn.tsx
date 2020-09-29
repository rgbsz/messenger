import React, { useState } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import firebase from "../firebase"
import { REQUEST_STATUS } from "../global.consts"
import LoadingScreen from "../LoadingScreen"

const SignIn: React.FC = () => {
  const [requestStatus, setRequestStatus] = useState<REQUEST_STATUS>(REQUEST_STATUS.NONE)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setRequestStatus(REQUEST_STATUS.PENDING)
    setTimeout(() => {
      firebase.auth().signInWithEmailAndPassword(email, password).then(() => console.log('logged in')).catch(() => {
        setRequestStatus(REQUEST_STATUS.FAILED)
      })
    }, 1500)
  }
  return (
    <Wrapper isBlurred={requestStatus === REQUEST_STATUS.PENDING}>
      <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
        <LoadingScreen form={true} visible={requestStatus === REQUEST_STATUS.PENDING} />
        <input
          type='text'
          placeholder='E-mail address'
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
        <input
          type='password'
          placeholder='Password'
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
        <p>{requestStatus === REQUEST_STATUS.FAILED && 'Wrong e-mail or password.'}</p>
        <input type='submit' value='Sign In' />
        <StyledLink to='/sign-up' blurprop={requestStatus === REQUEST_STATUS.PENDING}>I already have an account</StyledLink>
      </form>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ isBlurred: boolean }>`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.colors.primary};
  form {
    padding: 4rem;
    position: relative;
    overflow: hidden;
    border-radius: 2rem;
    background: ${({ theme }) => theme.colors.light};
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
    input[type='text'], input[type='password'] {
      border: none;
      padding: 1rem;
      border-radius: 2rem;
      background: white;
      width: 100%;
      margin-top: 1rem;
      box-sizing: border-box;
      box-shadow: 0 0 1rem rgba(0,0,0,.1);
      &:focus {
        outline: none;
      }
      filter: ${({ isBlurred }) => isBlurred ? 'blur(3rem)' : 'blur(0)'};
      transition: .5s ease-in-out;
    }
    p {
      margin-top: 1rem;
      color: ${({ theme }) => theme.colors.secondary};
      filter: ${({ isBlurred }) => isBlurred ? 'blur(3rem)' : 'blur(0)'};
      transition: .5s ease-in-out;
    }
    input[type='submit'] {
      border: none;
      padding: 1rem;
      border-radius: 2rem;
      background: ${({ theme }) => theme.colors.secondary};
      font-weight: bold;
      width: 100%;
      margin-top: 2rem;
      box-sizing: border-box;
      box-shadow: 0 0 1rem rgba(0,0,0,.1);
      color: white;
      filter: ${({ isBlurred }) => isBlurred ? 'blur(3rem)' : 'blur(0)'};
      transition: .5s ease-in-out;
      cursor: pointer;
      &:focus {
        outline: none;
      }
    }
  }
`

const StyledLink = styled(Link) <{ blurprop: boolean }>`
  filter: ${({ blurprop }) => blurprop ? 'blur(3rem)' : 'blur(0)'};
  transition: .5s ease-in-out;
  font-size: .8rem;
  margin-top: .5rem;
`

export default SignIn
