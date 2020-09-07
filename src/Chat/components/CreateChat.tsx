import React from 'react'
import styled from 'styled-components'

type createChatPropsTypes = {
    visible: boolean
}

const CreateChat: React.FC<createChatPropsTypes> = ({ visible }) => {
    return (
        <Wrapper visible={visible}>
            <Form>
                <TextField type='text' placeholder={'Email...'}/>
                <Button type={'submit'} value={'Invite to chat'}/>
            </Form>
        </Wrapper>
    )
}

const Wrapper = styled.div<createChatPropsTypes>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,.4);
  display: ${({ visible }) => visible ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
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