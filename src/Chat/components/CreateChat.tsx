import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import firebase from "../../firebase"

import { AuthContext } from "../../Auth/auth"
import { REQUEST_STATUS } from '../../global.consts'
import LoadingScreen from '../../LoadingScreen'

type inviteProps = {
  uid: string,
  fullname: string
}

type createChatPropsTypes = {
  visible: boolean
  createChatModalFunction: () => void
  invites: inviteProps[]
}

const CreateChat: React.FC<createChatPropsTypes> = ({ visible, createChatModalFunction, invites }) => {
  const { uid, email, fullname } = useContext(AuthContext)
  const [inputEmail, setInputEmail] = useState<null | string>(null)
  const [requestStatus, setRequestStatus] = useState<{ status: REQUEST_STATUS, message: string }>({ status: REQUEST_STATUS.NONE, message: '' })
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setRequestStatus({ status: REQUEST_STATUS.PENDING, message: '' })
    setTimeout(() => {
      firebase.firestore().collection('users').where('email', '==', inputEmail).get().then((snapshot => {
        if (inputEmail !== email) {
          if (snapshot.docs[0]) {
            firebase.firestore().collection('chats').doc(`${uid}_${snapshot.docs[0].id}`).get().then((a) => {
              if (a.data()) setRequestStatus({ status: REQUEST_STATUS.FAILED, message: `Chat with this user already exists.` })
              else {
                firebase.firestore().collection('chats').doc(`${snapshot.docs[0].id}_${uid}`).get().then((a) => {
                  if (a.data()) setRequestStatus({ status: REQUEST_STATUS.FAILED, message: `Chat with this user already exists.` })
                  else {
                    if (!snapshot.docs[0].data().invites.some((invite: { uid: string }) => invite.uid === uid)) {
                      if (invites?.some((invite: { uid: string }) => invite.uid === snapshot.docs[0].id)) {
                        firebase.firestore().collection('users').doc(`${uid}`).update({ 'invites': invites?.filter((item) => item.uid !== snapshot.docs[0].id) })
                        firebase.firestore().collection('chats').doc(`${uid}_${snapshot.docs[0].id}`).set({
                          id: `${uid}_${snapshot.docs[0].id}`,
                          messages: [],
                          users: [{ uid, fullname }, { uid: snapshot.docs[0].id, fullname: snapshot.docs[0].data().fullname }]
                        }).then(() => {
                          setRequestStatus({ status: REQUEST_STATUS.SUCCESS, message: `` })
                          createChatModalFunction()
                        })
                      }
                      else {
                        firebase.firestore().collection('users').doc(snapshot.docs[0].id).update({ 'invites': [...snapshot.docs[0].data().invites, { uid, fullname }] })
                        setRequestStatus({ status: REQUEST_STATUS.SUCCESS, message: `` })
                        createChatModalFunction()
                      }
                    }
                    else setRequestStatus({ status: REQUEST_STATUS.FAILED, message: `You've already invited this user.` })
                  }
                })
              }
            })

          }
          else {
            setRequestStatus({ status: REQUEST_STATUS.FAILED, message: `There's no user with provided e-mail address.` })
          }
        }
        else setRequestStatus({ status: REQUEST_STATUS.FAILED, message: `You can't invite yourself!.` })
      }))
    }, 1500)
  }
  return (
    <Wrapper blur={requestStatus.status === REQUEST_STATUS.PENDING} visible={visible}>
      <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
        <LoadingScreen form={true} visible={requestStatus.status === REQUEST_STATUS.PENDING} />
        <input
          type='text'
          placeholder='E-mail address'
          onInput={(e: React.FormEvent<HTMLInputElement>) => setInputEmail(e.currentTarget.value)}
        />
        <p>{requestStatus.status === REQUEST_STATUS.FAILED && requestStatus.message}</p>
        <input type='submit' value='Invite to chat' />
      </form>
      <div className='overlay' onClick={requestStatus.status !== REQUEST_STATUS.PENDING ? (() => createChatModalFunction()) : (() => { })} />
    </Wrapper>
  )
}

const Wrapper = styled.div<{ visible: boolean, blur: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,.8);
  opacity: ${({ visible }) => visible ? '1' : '0'};
  visibility: ${({ visible }) => visible ? 'visible' : 'hidden'};
  justify-content: center;
  display: flex;
  align-items: center;
  transition: .3s;
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
  }
  form {
    padding: 4rem;
    position: relative;
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
    &::before {
      border-radius: inherit;
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      opacity: 0.2;
      box-shadow: 0 0 1rem ${props => props.theme.colors.primary};
      z-index: -1;
    }
  }
`

export default CreateChat