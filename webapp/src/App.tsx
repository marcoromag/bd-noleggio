import React from 'react';
import {Layout} from './components/Layout'
import {GlobalContextProvider} from './GlobalContext'
import {BrowserRouter as Router, Route} from 'react-router-dom'

import './App.css';

import { Login } from './pages/Login';
import { PrivateRoute } from './components/PrivateRoute';
import { BatchScarico } from './pages/BatchScarico';
import { BatchCarico } from './pages/BatchCarico';
import { RicercaPerTitolo } from './pages/RicercaPerTitolo';
import { Noleggio } from './pages/Noleggio';
import { TerminaNoleggio } from './pages/TerminaNoleggio';
import { StatisticheDipendente } from './pages/StatisticheDipendente';


function App() {
  return (

    <Router basename="/noleggio/webapp">
    <GlobalContextProvider>
      <Layout>
        <Route exact path="/login">
          <Login/>
        </Route>
        <PrivateRoute path="/batch/scarico">
          <BatchScarico/>
        </PrivateRoute>
        <PrivateRoute path="/batch/carico">
          <BatchCarico/>
        </PrivateRoute>
        <PrivateRoute path="/ricerca/titolo">
          <RicercaPerTitolo/>
        </PrivateRoute>
        <PrivateRoute path="/noleggio/attiva">
          <Noleggio/>
        </PrivateRoute>
        <PrivateRoute path="/noleggio/termina">
          <TerminaNoleggio/>
        </PrivateRoute>
        <Route path="/statistiche/dipendente"><StatisticheDipendente/></Route>
      </Layout>
    </GlobalContextProvider>
    </Router>
  );
}

export default App;
