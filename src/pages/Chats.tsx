import React, { useState, useEffect, useContext } from "react"
import styled from "styled-components"
import firebase from "../firebase"

import LeftPanel from "../components/Chats/LeftPanel"
import { AuthContext } from "../auth"
import CenterPanel from "../components/Chats/CenterPanel"

const Chats: React.FC = () => {
  const { uid, fullname } = useContext(AuthContext)

  const [chat, setChat] = useState<any>(null)
  const [chats, setChats] = useState<any>([])
  const [chatIndex, setChatIndex] = useState<any>(1)

  useEffect(() => {
    firebase
      .firestore()
      .collection("chats")
      .where("users", "array-contains", { uid, fullname })
      .onSnapshot(snapshot => {
        let snapshotChats: any = []
        snapshot.forEach(chat => {
          let snapshotChat = {
            user: chat.data().users.filter((user: any) => user.uid !== uid)[0],
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
      setChat(chats[0])
    }
  }, [chats, chatIndex])
  return (
    <Wrapper>
      <Container>
        <LeftPanel
          setChatFunction={(e: any) => setChat(e)}
          setChatIndexFunction={(e: any) => setChatIndex(e)}
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
