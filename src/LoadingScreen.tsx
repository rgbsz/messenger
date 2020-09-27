import React from 'react'
import styled, { keyframes } from 'styled-components'

type propTypes = {
    visible?: boolean
    form?: boolean
}

const LoadingScreen: React.FC<propTypes> = ({ visible = true, form = false }) => {
    return (
        <Wrapper visibility={visible} form={form}><div /></Wrapper>
    )
}

const Keyframes = keyframes`
    0% {
        transform: rotate(0deg)
    }
    100% {
        transform: rotate(360deg)
    }
`

const Wrapper = styled.div<{ visibility: boolean, form: boolean }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: ${({ form }) => form ? '100%' : '100vh'};
    opacity: ${({ visibility }) => visibility ? '1' : '0'};
    visibility: ${({ visibility }) => visibility ? 'visible' : 'hidden'};
    transition: .3s;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: all;
    z-index: 99;
    div {
        border: 3px solid rgba(0,0,0,0);
        border-top: 3px solid ${({ theme }) => theme.colors.primary};
        border-radius: 50%;
        width: 5rem;
        height: 5rem;
        animation: ${Keyframes} 1s infinite linear;
    }
`

export default LoadingScreen