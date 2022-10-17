import { Heading } from '@chakra-ui/react'
import { useState } from 'react'
import './App.css'

import UserGraph from './UserGraph'

function App() {
  // const [count, setCount] = useState(0)


  return (
    <div className="App">
      <Heading>Team 81's Github Exlorer!</Heading>
      <UserGraph />
      {/* <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </div>
  )
}

export default App
