import { firestore } from "firebase"
import React, { useState } from "react"
import styled from "styled-components"
import firebase from "../firebase"

import { firstnameTypes, lastnameTypes, emailTypes, passwordTypes } from "./SignUp.types"

const SignUp: React.FC = () => {
    const [firstname, setFirstname] = useState<firstnameTypes>(null)
    const [lastname, setLastname] = useState<lastnameTypes>(null)
    const [email, setEmail] = useState<emailTypes>(null)
    const [password, setPassword] = useState<passwordTypes>(null)
    const [passwordRepeat, setPasswordRepeat] = useState<passwordTypes>(null)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (firstname && lastname && email && password && passwordRepeat) {
            if (password !== passwordRepeat) alert('Passwords.')
            else {
                firebase.auth().createUserWithEmailAndPassword(email, password).then((data) => {
                    firebase.firestore().collection('users').doc(data.user?.uid).set({
                        email,
                        fullname: `${firstname} ${lastname}`,
                        invites: []
                    })
                });
            }
        }
        else {
            alert(`Fields.`)
        }
    }
    return (
        <Wrapper>
            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
                <input
                    type='text'
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFirstname(e.target.value)
                    }
                />
                <input
                    type='text'
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setLastname(e.target.value)
                    }
                />
                <input
                    type='text'
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                    }
                />
                <input
                    type='password'
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                    }
                />
                <input
                    type='password'
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPasswordRepeat(e.target.value)
                    }
                />
                <input type='submit' />
            </form>
        </Wrapper>
    )
}

const Wrapper = styled.div``

export default SignUp
