import React, { useState, useEffect, useContext } from "react"
import styled from "styled-components"
import firebase from "../firebase"

import { AuthContext } from "../Auth/auth"

import LeftPanel from "./components/LeftPanel"
import CenterPanel from "./components/CenterPanel"

import { chatUserTypes, chatTypes } from "../global.types"

const Chats: React.FC = () => {
  const { uid, fullname } = useContext(AuthContext)
  const [chats, setChats] = useState<chatTypes[]>([])
  const [chatIndex, setChatIndex] = useState<number>(1)

  useEffect(() => {
    firebase
      .firestore()
      .collection("chats")
      .where("users", "array-contains", { uid, fullname })
      .onSnapshot(snapshot => {
        let snapshotChats: chatTypes[] = []
        snapshot.forEach(chat => {
          let snapshotChat = {
            user: chat
              .data()
              .users.filter((user: chatUserTypes) => user.uid !== uid)[0],
            messages: chat.data().messages,
            id: chat.data().id,
          }
          snapshotChats.push(snapshotChat)
        })
        setChats(snapshotChats)
      })
  }, [])
  useEffect(() => {
    if (!chatIndex && chats) {
      setChatIndex(1)
    }
  }, [chats, chatIndex])
  return (
    <Wrapper>
      <Container>
        <LeftPanel
          setChatIndexFunction={(e: number) => setChatIndex(e)}
          chatIndex={chatIndex}
          chats={chats}
        />
        <CenterPanel chat={chats[chatIndex - 1]} />
      </Container>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  background: ${props => props.theme.colors.primary};
  padding: 2rem;
  position: relative;
  box-sizing: border-box;
`

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.theme.colors.light};
  border-radius: 2rem;
  position: relative;
  z-index: 0;
  display: flex;
`

export default Chats
