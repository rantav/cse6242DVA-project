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
          clientId={import.meta.env.VITE_GH_CLIENT_ID}
          redirectUri={import.meta.env.VITE_GH_REDIRECT_URI}/>

      <Heading>Team 81's Github Exlorer! </Heading>
      <UserGraph />
    </div>
  )
}

export default App
