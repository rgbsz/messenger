import React from 'react'
import styled, { keyframes } from 'styled-components'

type propTypes = {
    visible?: boolean
    form?: boolean
}

const LoadingScreen: React.FC<propTypes> = ({ visible = true, form = false }) => {
    return (
        <Wrapper visibilityProp={visible} formProp={form ? true : false}><div /></Wrapper>
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

const Wrapper = styled.div<{ visibilityProp: boolean, formProp: boolean }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: ${({ formProp }) => formProp ? '100%' : '100vh'};
    opacity: ${({ visibilityProp }) => visibilityProp ? '1' : '0'};
    visibility: ${({ visibilityProp }) => visibilityProp ? 'visible' : 'hidden'};
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