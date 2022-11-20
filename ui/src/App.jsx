import React, { useState } from 'react';
import UsersGraphContainer from './UsersGraphContainer'
import WithSubnavigation from './Nav'
import './App.css'
import DetailsPane from './DetailsPane'
import { SimpleGrid, Box, Center, Text, Square, Flex } from '@chakra-ui/react'

function App() {
  const [entity, setEntity] = useState({login: 'rantav', type: 'user'});

  return (
    <div className="App">

      <WithSubnavigation/>
      <Flex>
        <Center w='100px'>
          <DetailsPane entity={entity}/>
        </Center>
        <Box flex='1'>
          <UsersGraphContainer setSelectedEntity={setEntity}/>
        </Box>
      </Flex>
    </div>
  )
}

export default App
