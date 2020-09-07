import React, { useContext } from "react"
import { Router as BrowserRouter, Route, Redirect } from "react-router-dom"
import { createGlobalStyle } from "styled-components"
import history from "./history"
import { AuthContext } from "./Auth/auth"
import SignIn from "./SignIn/SignIn"
import Chats from "./Chat/Chat"
import AuthProvider from "./Auth/auth"
import { RouteTypes } from "./App.types"
import {REQUEST_STATUS} from "./global.consts"
import LoadingScreen from "./LoadingScreen"

const GLOBAL_STYLE = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    font-family: 'Ubuntu', sans-serif!important;
  }
`

const UnprotectedRoute = ({ component: Component, ...rest }: RouteTypes) => {
    const { uid, requestStatus } = useContext(AuthContext)
    return (
        <Route
            {...rest}
            render={(props: any) => {
                if(requestStatus === REQUEST_STATUS.PENDING || requestStatus === REQUEST_STATUS.NONE) return <LoadingScreen/>
                else if (!uid) return <Component {...props} />
                else return <Redirect to='/chat' />
            }}
        />
    )
}

const ProtectedRoute = ({ component: Component, ...rest }: RouteTypes) => {
    const { uid, requestStatus } = useContext(AuthContext)
    return (
        <Route
            {...rest}
            render={(props: any) => {
                if (requestStatus === REQUEST_STATUS.PENDING || requestStatus === REQUEST_STATUS.NONE) return <LoadingScreen/>
                else if (uid) return <Component {...props} />
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
