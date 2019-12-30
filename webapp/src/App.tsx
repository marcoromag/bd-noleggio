import React from 'react';
import {Layout} from './components/Layout'
import {GlobalContextProvider} from './GlobalContext'
import {BrowserRouter as Router, Route} from 'react-router-dom'

import './App.css';
import { Menu } from './components/Menu';
import { Login } from './pages/Login';
import { PrivateRoute } from './components/PrivateRoute';
import { BatchScarico } from './pages/BatchScarico';
import { BatchCarico } from './pages/BatchCarico';
import { RicercaPerTitolo } from './pages/RicercaPerTitolo';


function App() {
  return (

    <Router>
    <GlobalContextProvider>
      <Layout menu={<Menu/>}>
        <Route exact path="/login">
          <Login/>
        </Route>
        <PrivateRoute path="/private">
        <BatchScarico></BatchScarico>
        </PrivateRoute>
        <PrivateRoute path="/dirigente/batch/scarico">
          <BatchScarico/>
        </PrivateRoute>
        <PrivateRoute path="/dirigente/batch/carico">
          <BatchCarico/>
        </PrivateRoute>
        <PrivateRoute path="/ricerca/titolo">
          <RicercaPerTitolo/>
        </PrivateRoute>
      </Layout>
    </GlobalContextProvider>
    </Router>
  );
}

export default App;
