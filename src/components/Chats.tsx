import React, { useState, useEffect } from "react"
import styled from "styled-components"
import history from "../history"

import LeftPanel from "./Chats/LeftPanel"

const Chats: React.FC = () => {
  const [chat, setChat] = useState<any>(null)
  useEffect(() => {
    if (!localStorage.getItem("uid")) history.push("/sign-in")
  }, [])
  return (
    <Wrapper>
      <Container>
        <LeftPanel setChatFunction={(e: any) => setChat(e)} />
        <Messages>
          {chat?.messages.map((message: any) => (
            <Message own={true}>{message.content}</Message>
          ))}
        </Messages>
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

const Messages = styled.div`
  overflow-y: scroll;
  flex: 1;
  padding: 1.5rem 2rem 2rem 1rem;
  display: flex;
  flex-direction: column;
`

const Message = styled.div<{ own: boolean }>`
  background: ${props => (props.own ? props.theme.colors.secondary : "white")};
  color: ${props => (props.own ? "white" : "black")};
  padding: 1rem;
  border-radius: ${props =>
    props.own ? "2rem 2rem 0 2rem" : "2rem 2rem 2rem 0"};
  margin: 0.5rem 0;
  max-width: 50%;
  align-self: ${props => (props.own ? "flex-end" : "flex-start")};
  box-sizing: border-box;
  position: relative;
  z-index: 0;
  &::before {
    display: ${props => (props.own ? "none" : "block")};
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

export default Chats
