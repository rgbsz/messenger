import React, { useContext, useState } from "react"
import styled from "styled-components"
import firebase from "../../firebase"

import { AuthContext } from "../../Auth/auth"

import { chatTypes, chatMessageTypes } from "../../global.types"

const CenterPanel: React.FC<{ chat: chatTypes }> = ({ chat }) => {
  const { fullname } = useContext(AuthContext)
  const [lineBreaks, setLineBreaks] = useState<number>(0)
  const [messageContent, setMessageContent] = useState<string>("")

  const HandleTextArea = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (messageContent.trim()) {
        firebase
          .firestore()
          .collection("/chats")
          .doc(chat.id)
          .update({
            messages: [
              { author: fullname, content: messageContent },
              ...chat.messages,
            ],
          })
      }
    }
  }
  return (
    <Wrapper>
      <Messages>
        {chat?.messages.map(
          ({ author, content }: chatMessageTypes, i: number) => (
            <Message own={author === fullname ? true : false} key={i}>
              {content}
            </Message>
          )
        )}
      </Messages>
      <Controls>
        <textarea
          onKeyPress={e => HandleTextArea(e)}
          rows={lineBreaks + 1}
          onInput={(e: any) => {
            setLineBreaks((e.target.value.match(/\n/g) || []).length)
            setMessageContent(e.target.value)
          }}
        ></textarea>
      </Controls>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: 1.5rem 2rem 2rem 1rem;
  display: flex;
  flex-direction: column;
  position: relative;
  max-height: 100%;
  width: 100%;
  box-sizing: border-box;
`

const Messages = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  padding: 0 1rem 1rem 0;
  margin-bottom: 1rem;
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

const Message = styled.div<{ own: boolean }>`
  background: ${({ own, theme }) => (own ? theme.colors.secondary : "white")};
  align-self: ${({ own }) => (own ? "flex-end" : "flex-start")};
  position: relative;
  border-radius: ${({ own }) =>
    own ? "2rem 2rem 0 2rem" : "2rem 2rem 2rem 0"};
  padding: 1.5rem;
  margin: 0.5rem 0;
  &::before {
    display: ${({ own }) => (own ? "none" : "block")};
    border-radius: inherit;
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0.15;
    box-shadow: 0.7rem 0.7rem 1.3rem ${props => props.theme.colors.primary};
    z-index: -1;
  }
`

const Controls = styled.form`
  width: 100%;
  background: white;
  padding: 0 1.5rem;
  box-sizing: border-box;
  border-radius: 2rem;
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
  textarea {
    width: 100%;
    margin-top: 0.2rem;
    &:focus {
      outline: none;
    }
    border: none;
    resize: none;
    padding: 1rem 0;
  }
`

export default CenterPanel
