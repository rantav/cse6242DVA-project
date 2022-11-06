import { Heading } from '@chakra-ui/react'
import GitHubLogin from 'react-github-login';
import UserGraph from './UserGraph'
import './App.css'

const onSuccess = response => console.log(response);
const onFailure = response => console.error(response);

function App() {
  return (
    <div className="App">
        <GitHubLogin
          onSuccess={onSuccess}
          onFailure={onFailure}
          // clientId="9106310b56184deea4c5"
          // redirectUri={'http://127.0.0.1:8000/github/callback'}
          clientId="0d7406453e9569a409f3"
          redirectUri={'https://tqxkew8dxk.execute-api.eu-west-1.amazonaws.com/api/github/callback'}
          />

      <Heading>Team 81's Github Exlorer!</Heading>
      <UserGraph />
    </div>
  )
}

export default App
