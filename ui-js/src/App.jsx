import { useState } from 'react'
import { Heading } from '@chakra-ui/react'
import UserGraph from './UserGraph'
import './App.css'

function App() {
  return (
    <div className="App">
      <Heading>Team 81's Github Exlorer!</Heading>
      <UserGraph />
    </div>
  )
}

export default App
