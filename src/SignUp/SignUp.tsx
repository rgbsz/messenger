import React, { useState } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import firebase from "../firebase"
import { REQUEST_STATUS } from "../global.consts"
import LoadingScreen from "../LoadingScreen"

const SignUp: React.FC = () => {
    const [requestStatus, setRequestStatus] = useState<{ status: REQUEST_STATUS, message: string }>({ status: REQUEST_STATUS.NONE, message: '' })
    const [firstname, setFirstname] = useState<string>('')
    const [lastname, setLastname] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [passwordRepeat, setPasswordRepeat] = useState<string>('')
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setRequestStatus({ status: REQUEST_STATUS.PENDING, message: '' })
        setTimeout(() => {
            if (password !== passwordRepeat) {
                setRequestStatus({ status: REQUEST_STATUS.FAILED, message: `Passwords aren't the same.` })
            }
            else {
                firebase.auth().createUserWithEmailAndPassword(email, password).then((data) => {
                    firebase.firestore().collection('users').doc(data.user?.uid).set({
                        email,
                        fullname: `${firstname} ${lastname}`,
                        invites: []
                    })
                }).catch(({ message }) => {
                    console.log(e)
                    setRequestStatus({ status: REQUEST_STATUS.FAILED, message })
                });
            }
        }, 1500)
    }
    return (
        <Wrapper blur={requestStatus.status === REQUEST_STATUS.PENDING}>
            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
                <LoadingScreen form={true} visible={requestStatus.status === REQUEST_STATUS.PENDING} />
                <input
                    type='text'
                    placeholder='Firstname'
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFirstname(e.target.value)
                    }
                />
                <input
                    type='text'
                    placeholder='Lastname'
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setLastname(e.target.value)
                    }
                />
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
                <input
                    type='password'
                    placeholder='Repeat password'
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPasswordRepeat(e.target.value)
                    }
                />
                <p>{requestStatus.status === REQUEST_STATUS.FAILED && requestStatus.message}</p>
                <input type='submit' value='Sign In' />
                <StyledLink to='/sign-in' blur={requestStatus.status === REQUEST_STATUS.PENDING}>I dont have account</StyledLink>
            </form>
        </Wrapper>
    )
}

const Wrapper = styled.div<{ blur: boolean }>`
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
      filter: ${({ blur }) => blur ? 'blur(3rem)' : 'blur(0)'};
      transition: .5s ease-in-out;
    }
    p {
      margin-top: 1rem;
      color: ${({ theme }) => theme.colors.secondary};
      filter: ${({ blur }) => blur ? 'blur(3rem)' : 'blur(0)'};
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
      filter: ${({ blur }) => blur ? 'blur(3rem)' : 'blur(0)'};
      transition: .5s ease-in-out;
      cursor: pointer;
      &:focus {
        outline: none;
      }
    }
  }
`

const StyledLink = styled(Link) <{ blur: boolean }>`
  filter: ${({ blur }) => blur ? 'blur(3rem)' : 'blur(0)'};
  transition: .5s ease-in-out;
  font-size: .8rem;
  margin-top: .5rem;
`

export default SignUp
