import UserGraph from './UserGraph'
import UsersGraphContainer from './UsersGraphContainer'
import WithSubnavigation from './Nav'
import './App.css'

function App() {

  return (
    <div className="App">
      <WithSubnavigation/>
      <UsersGraphContainer/>
    </div>
  )
}

export default App
