import React, { useState, useEffect } from "react"
import styled from "styled-components"

import firebase from "../../firebase"

import PlusIcon from "../../img/PlusIcon"

const LeftPanel: React.FC<{ setChatFunction: Function }> = ({
  setChatFunction,
}) => {
  const [chatIndex, setChatIndex] = useState<any>(null)
  const [chats, setChats] = useState<any>([])
  const [userIndexes, setUserIndexes] = useState<any>([])
  const [users, setUsers] = useState<any>([])
  const db = firebase.firestore()
  useEffect(() => {
    db.collection("chats")
      .where("users", "array-contains", "wnvZnnooTs0YWPEcE1Hf")
      .onSnapshot(snapshot => {
        let snapshotChats: any = []
        let snapshotUsers: any = []
        snapshot.forEach((item: any) => {
          let snapshotUser: any = []
          item.data().users.forEach((user: any) => {
            if (!snapshotUsers.includes(user)) snapshotUsers.push(user)
            if (user !== "wnvZnnooTs0YWPEcE1Hf") snapshotUser.push(user)
          })

          snapshotChats.push({
            id: item.id,
            messages: item.data().messages,
            user: snapshotUser[0],
          })
        })
        setChats(snapshotChats)
        setUserIndexes(snapshotUsers)
        if (!chatIndex && snapshotChats) setChatIndex(1)
      })
  }, [])
  useEffect(() => {
    if (userIndexes.length > 0) {
      db.collection("users")
        .where("id", "in", userIndexes)
        .onSnapshot(snapshot => {
          let snapshotUsers: any = []
          snapshot.forEach((item: any) => {
            console.log(item.data())
            snapshotUsers.push({
              id: item.data().id,
              displayname: item.data().displayname,
            })
          })
          setUsers(snapshotUsers)
        })
    }
  }, [userIndexes.length])
  const getUserName = (id: string) => {
    let userName
    users.forEach((item: any) => {
      if (item.id === id) userName = item.displayname
    })
    return userName
  }
  return (
    <Wrapper>
      <Header activeChat={chatIndex}>
        <HeaderCreateChatButton>
          <div>
            <PlusIcon />
          </div>
          Create New
        </HeaderCreateChatButton>
        <SearchBar type='text' placeholder='Search...' />
      </Header>
      <Chats>
        {chats.map((chat: any, i: number) => (
          <Chat
            activeChat={chatIndex}
            onClick={() => {
              setChatFunction(chats[i])
              setChatIndex(i + 1)
            }}
            key={chat.name}
          >
            <ChatImg />
            <ChatInfo>
              <ChatTitle>{`${getUserName(chat.user)}`}</ChatTitle>
              <ChatLastMessage>
                {chat.messages[chat.messages.length - 1].content.length > 25
                  ? chat.messages[chat.messages.length - 1].content.substr(
                      0,
                      22
                    ) + "..."
                  : chat.messages[chat.messages.length - 1].content}
              </ChatLastMessage>
            </ChatInfo>
          </Chat>
        ))}
      </Chats>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 18rem;
  padding: 2rem 1rem 2rem 2rem;
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

const SearchBar = styled.input`
  border: none;
  padding: 1rem;
  border-radius: 2rem;
  background: ${props => props.theme.colors.light};
  width: 100%;
  margin-top: 1.5rem;
  box-sizing: border-box;
  &:focus {
    outline: none;
  }
`

const Chats = styled.div``

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
    border-radius: 0 0 2rem 2rem;
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

const ChatImg = styled.div`
  min-width: 3rem;
  min-height: 3rem;
  background: url("https://www.commondreams.org/sites/default/files/views-article/elonmusk.jpeg");
  background-position: center;
  background-size: cover;
  border-radius: 50%;
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
