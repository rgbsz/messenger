import React from "react"
import { BrowserRouter, Route } from "react-router-dom"
import { createGlobalStyle } from "styled-components"

import Chats from "./components/Chats"

const GLOBAL_STYLE = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,400;1,700&display=swap');
  * {
    margin: 0;
    padding: 0;
    font-family: 'Ubuntu', sans-serif!important;
  }
`

function App() {
  return (
    <BrowserRouter>
      <GLOBAL_STYLE />
      <Route exact path='/chats/:id' component={Chats} />
    </BrowserRouter>
  )
}

export default App
