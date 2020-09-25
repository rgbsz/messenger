import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import firebase from "../../firebase"

import { AuthContext } from "../../Auth/auth"

type createChatPropsTypes = {
  visible: boolean
  createChatModalFunction: () => void
}

const CreateChat: React.FC<createChatPropsTypes> = ({ visible, createChatModalFunction }) => {
  const { uid, email, fullname } = useContext(AuthContext)
  const [inputEmail, setInputEmail] = useState<null | string>(null)
  const handleSubmit = (e: any) => {
    e.preventDefault()
    firebase.firestore().collection('users').where('email', '==', inputEmail).get().then((snapshot => {
      if (inputEmail !== email) {
        if (snapshot.docs[0]) {
          if (!snapshot.docs[0].data().invites.includes(uid)) {
            firebase.firestore().collection('users').doc(snapshot.docs[0].id).update({ 'invites': [...snapshot.docs[0].data().invites, { uid, fullname }] })
          }
          else alert('Juz zaproszony')
        }
        else {
          alert('Nie ma takiego uzytkownika')
        }
      }
      else alert('Nie możesz zaprosić sam siebie.')
    }))
  }
  return (
    <Wrapper visible={visible}>
      <Form onSubmit={(e: any) => handleSubmit(e)}>
        <TextField type='text' placeholder={'Email...'} onInput={(e: any) => setInputEmail(e.target.value)} />
        <Button type={'submit'} value={'Invite to chat'} />
      </Form>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,.4);
  opacity: ${({ visible }) => visible ? '1' : '0'};
  visibility: ${({ visible }) => visible ? 'visible' : 'hidden'};
  justify-content: center;
  display: flex;
  align-items: center;
  transition: .3s;
`

const Form = styled.form`
 padding: 2rem;
 background: white;
 position: relative;
 border-radius: 2rem;
 display: flex;
 flex-direction: column;
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
`

const TextField = styled.input`
  padding: 1rem;
  border-radius: 2rem;
  border: none;
  box-shadow: 0 0 1rem rgba(0,0,0,.2);
  &:focus {
    outline: none;
  }
`

const Button = styled.input`
  padding: 1rem;
  border-radius: 2rem;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  color: white;
  margin-top: 2rem;
`

export default CreateChat