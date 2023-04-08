import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {DataProvider} from './GlobalState'
import Header from './componants/headers/Header'
import MainPages from './componants/mainpages/Pages'

function App() {
  return (
    <DataProvider>
    <Router>
    <div class Name="App">
      <Header />
      <MainPages />
    </div>
    </Router>
    </DataProvider>
  );
}

export default App;
