import React, { useState } from 'react';
import UsersGraphContainer from './UsersGraphContainer'
import WithSubnavigation from './Nav'
import './App.css'
import DetailsPane from './DetailsPane'
import Help from './Help'
import { Box, HStack, } from '@chakra-ui/react'


function App() {

  return (
    <div className="App">
      <WithSubnavigation/>
      <UsersGraphContainer/>
      <Help/>
    </div>
  )
}

export default App
