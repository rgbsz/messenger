import React, { useContext } from "react"
import { Router as BrowserRouter, Route, Redirect, Switch, RouteProps } from "react-router-dom"
import { createGlobalStyle } from "styled-components"
import history from "./history"
import { AuthContext } from "./Auth/auth"
import SignIn from "./SignIn/SignIn"
import Chats from "./Chat/Chat"
import AuthProvider from "./Auth/auth"
import { RouteTypes } from "./App.types"
import { REQUEST_STATUS } from "./global.consts"
import LoadingScreen from "./LoadingScreen"
import SignUp from "./SignUp/SignUp"

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
            render={(props: RouteProps) => {
                if (requestStatus === REQUEST_STATUS.PENDING || requestStatus === REQUEST_STATUS.NONE) return <LoadingScreen />
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
            render={(props: RouteProps) => {
                if (requestStatus === REQUEST_STATUS.PENDING || requestStatus === REQUEST_STATUS.NONE) return <LoadingScreen />
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
                <Switch>
                    <UnprotectedRoute exact path='/sign-in' component={SignIn} />
                    <UnprotectedRoute exact path='/sign-up' component={SignUp} />
                    <ProtectedRoute exact path='/chat' component={Chats} />
                    <Route render={() => <Redirect to={'/sign-in'} />} />
                </Switch>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App
