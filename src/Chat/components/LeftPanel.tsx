import React, { useContext, useState, useEffect } from "react"
import styled from "styled-components"
import firebase from '../../firebase'
import { AuthContext } from "../../Auth/auth"

import PlusIcon from "../../img/PlusIcon"
import { chatTypes } from "../../global.types"
import { inviteTypes } from '../../Auth/auth.types'

const LeftPanel: React.FC<{
  chatIndex: number
  chats: chatTypes[]
  setChatIndexFunction: (e: number) => void
  createChatModalFunction: () => void
  invites: inviteTypes[]
}> = ({ chatIndex, chats, setChatIndexFunction, createChatModalFunction, invites }) => {
  const { uid, fullname } = useContext(AuthContext)
  const handleAccept = (e: React.MouseEvent<HTMLSpanElement>) => {
    firebase.firestore().collection('users').doc(`${uid}`).update({ 'invites': invites?.filter((item: inviteTypes) => item.uid !== e.currentTarget.dataset.uid) })
    firebase.firestore().collection('chats').doc(`${uid}_${e.currentTarget.dataset.uid}`).set({
      id: `${uid}_${e.currentTarget.dataset.uid}`,
      messages: [],
      users: [{ uid, fullname }, { uid: e.currentTarget.dataset.uid, fullname: e.currentTarget.dataset.fullname }]
    })
  }
  const handleDecline = (e: React.MouseEvent<HTMLSpanElement>) => {
    firebase.firestore().collection('users').doc(`${uid}`).update({ 'invites': invites?.filter((item: inviteTypes) => item.uid !== e.currentTarget.dataset.uid) })
  }
  return (
    <Wrapper>
      <Header activeChat={chatIndex}>
        <HeaderCreateChatButton onClick={() => createChatModalFunction()}>
          <div>
            <PlusIcon />
          </div>
          Create New
        </HeaderCreateChatButton>
        {
          invites?.map((invite: inviteTypes) => <p key={invite.uid}>{invite.fullname} - <span data-uid={invite.uid} data-fullname={invite.fullname} onClick={(e) => handleAccept(e)}>Akceptuj</span> | <span data-uid={invite.uid} onClick={(e: React.MouseEvent<HTMLSpanElement>) => handleDecline(e)}>Odrzuć</span></p>)
        }
        <p><span onClick={() => firebase.auth().signOut()}>Sign Out</span></p>
      </Header>
      <Chats>
        {chats.map((chat: chatTypes, i: number) => (
          <Chat
            activeChat={chatIndex}
            onClick={() => {
              setChatIndexFunction(i + 1)
            }}
            key={i}
          >
            <ChatInfo>
              <ChatTitle>{chat.user.fullname}</ChatTitle>
              <ChatLastMessage>
                {chat.messages.length > 0
                  ? chat.messages[0].content.length > 25
                    ? chat.messages[0].content.substr(0, 22) + "..."
                    : chat.messages[0].content
                  : "Say hello!"}
              </ChatLastMessage>
            </ChatInfo>
          </Chat>
        ))}
      </Chats>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 26rem;
  padding: 2rem 1rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  position: relative;
  &::after {
    width: calc(100% - 2rem);
    height: 2rem;
    background: linear-gradient(0deg, rgba(243,246,255,1) 0%, rgba(243,246,255,0) 100%);
    content: '';
    position: absolute;
    bottom: 2rem;
    left: 0;
  }
`

const Header = styled.div<{ activeChat: number | null }>`
  background: white;
  border-radius: ${props =>
    props.activeChat
      ? props.activeChat === 1
        ? "2rem 2rem 2rem 0"
        : "2rem 2rem 0 0"
      : "2rem 2rem 0 0"};
  padding: 1rem;
  position: relative;
  p {
    width: 100%;
    font-size: .8rem;
    text-align: center;
    span {
      text-decoration: underline;
      cursor: pointer;
    }
    margin-top: .2rem;
    &:first-of-type {
      margin-top: 1rem;
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
    box-shadow: 0 0 1.5rem ${props => props.theme.colors.primary};
    z-index: -1;
  }
`

const HeaderCreateChatButton = styled.button`
  padding: 1.5rem;
  width: 100%;
  border: none;
  position: relative;
  z-index: 0;
  border-radius: 2rem;
  background: white;
  font-weight: bold;
  font-size: 1rem;
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
  &:focus {
    outline: 0;
  }
  div {
    position: absolute;
    top: 0.6rem;
    left: 0.6rem;
    height: 3rem;
    width: 3rem;
    border-radius: 50%;
    background: ${props => props.theme.colors.light};
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      width: 2rem;
      fill: ${props => props.theme.colors.primary};
    }
  }
`

const Chats = styled.div`
  fill: 1;
  position: relative;
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.light};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.secondary};
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.light};
  }
`

const Chat = styled.div<{ activeChat: number | null }>`
  box-sizing: border-box;
  width: 100%;
  background: white;
  position: relative;
  display: flex;
  align-items: center;
  padding: 1rem;
  border-left: 3px solid rgba(0, 0, 0, 0);
  cursor: pointer;
  &::before {
    border-radius: inherit;
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0.2;
    box-shadow: 0 0 1.5rem ${props => props.theme.colors.primary};
    z-index: -1;
  }
  &:last-child {
    border-radius: 0 0 2rem 2rem !important;
  }
  &:nth-child(${props => (props.activeChat ? props.activeChat - 1 : -1)}) {
    border-radius: 0 0 2rem 0;
  }
  &:nth-child(${props => (props.activeChat ? props.activeChat : -1)}) {
    background: none;
    border-radius: 0 !important;
    border-left: 3px solid ${props => props.theme.colors.secondary};
    &::before {
      box-shadow: none;
    }
  }
  &:nth-child(${props => (props.activeChat ? props.activeChat + 1 : -1)}) {
    border-radius: 0 2rem 0 0;
  }
`

const ChatInfo = styled.div`
  margin-left: 0.5rem;
`

const ChatTitle = styled.span`
  display: block;
  font-weight: bold;
`

const ChatLastMessage = styled.span`
  display: block;
  color: ${props => props.theme.colors.grey};
  font-size: 0.9rem;
`

export default LeftPanel
