import React, { useState, useEffect } from "react"
import styled from "styled-components"
import firebase from "../firebase"

const Chats: React.FC<{ location: { pathname: string } }> = ({ location }) => {
  const [chats, setChats] = useState<any>([])
  const [chat, setChat] = useState<any>(null)
  const db = firebase.firestore()
  useEffect(() => {
    db.collection("chats")
      .where("users", "array-contains", "rgbsz")
      .onSnapshot((snapshot: any) => {
        let snapshotChats: any = []
        snapshot.forEach((item: any) =>
          snapshotChats.push({ id: item.id, ...item.data() })
        )
        setChats(snapshotChats)
      })
  }, [])
  return (
    <Container>
      <ChatsPanel>
        {chats.map((chat: any, i: number) => (
          <div onClick={() => setChat([i])} key={chat.name}>
            <p>{chat.name}</p>
            <span>{chat.messages[chat.messages.length - 1].content}</span>
          </div>
        ))}
      </ChatsPanel>
      <Messages>
        {chat &&
          chats[chat].messages.map((message: any) => (
            <Message own={message.author === "rgbsz" ? true : false}>
              <span>{message.author}</span>
              <p>{message.content}</p>
            </Message>
          ))}
      </Messages>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
`

const ChatsPanel = styled.div`
  width: 15rem;
  padding: 0 1rem;
  div {
    border-radius: 0.3rem;
    box-sizing: border-box;
    width: 100%;
    padding: 1rem;
    background: #f2f2f2;
    margin: 1rem 0;
    cursor: pointer;
    p {
      font-weight: bold;
    }
    span {
      color: #cccccc;
    }
  }
`

const Messages = styled.div`
  flex: 1;
  padding: 0.5rem 1rem 1rem 0;
  display: flex;
  flex-direction: column;
`

const Message = styled.div<{ own: boolean }>`
  background: ${props => (props.own ? "#303030" : "#f2f2f2")};
  color: ${props => (props.own ? "white" : "black")};
  padding: 1rem;
  border-radius: 0.3rem;
  margin: 0.5rem 0;
  max-width: 50%;
  align-self: ${props => (props.own ? "flex-end" : "flex-start")};
  box-sizing: border-box;
`

export default Chats
