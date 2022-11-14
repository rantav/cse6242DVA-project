import React, { useState, useEffect, useRef } from 'react';
import UsersGraphContainer from './UsersGraphContainer'
import WithSubnavigation from './Nav'
import './App.css'
import DetailsPane from './DetailsPane'

function App() {
  const [entity, setEntity] = useState({login: 'rantav', type: 'user'});

  return (
    <div className="App">
      <WithSubnavigation/>
      <UsersGraphContainer setSelectedEntity={setEntity}/>
      <DetailsPane entity={entity}/>
    </div>
  )
}

export default App
