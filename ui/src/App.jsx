import { useState } from 'react'
import { Heading } from '@chakra-ui/react'
import GitHubLogin from 'react-github-login';
import UserGraph from './UserGraph'
import './App.css'

const onSuccess = response => console.log(response);
const onFailure = response => console.error(response);

function App() {
  return (
    <div className="App">
        <GitHubLogin clientId="9106310b56184deea4c5"
          onSuccess={onSuccess}
          onFailure={onFailure}
          redirectUri={'http://127.0.0.1:8000/github/callback'}/>
      <Heading>Team 81's Github Exlorer!</Heading>
      <UserGraph />
    </div>
  )
}

export default App
