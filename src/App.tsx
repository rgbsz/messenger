import React, { useEffect, useState, useContext } from "react"
import {
  Router as BrowserRouter,
  Route,
  RouteProps,
  Redirect,
} from "react-router-dom"
import { createGlobalStyle } from "styled-components"
import history from "./history"
import firebase from "./firebase"
import { AuthContext } from "./auth"
import SignIn from "./pages/SignIn"
import Chats from "./pages/Chats"
import AuthProvider from "./auth"

const GLOBAL_STYLE = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,400;1,700&display=swap');
  * {
    margin: 0;
    padding: 0;
    font-family: 'Ubuntu', sans-serif!important;
  }
`

const UnprotectedRoute = ({ component: Component, ...rest }: any) => {
  const { uid } = useContext(AuthContext)
  return (
    <Route
      {...rest}
      render={(props: any) => {
        if (!uid) return <Component {...props} />
        else return <Redirect to='/chat' />
      }}
    />
  )
}

const ProtectedRoute = ({ component: Component, ...rest }: any) => {
  const { uid } = useContext(AuthContext)
  return (
    <Route
      {...rest}
      render={(props: any) => {
        if (uid) return <Component {...props} />
        else return <Redirect to='/sign-in' />
      }}
    />
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter history={history}>
        <GLOBAL_STYLE />
        <UnprotectedRoute exact path='/sign-in' component={SignIn} />
        <ProtectedRoute exact path='/chat' component={Chats} />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
