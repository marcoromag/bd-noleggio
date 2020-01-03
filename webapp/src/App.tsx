import React from 'react';
import {GlobalContextProvider} from './GlobalContext'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import { Login } from './pages/Login';
import { PrivateRoute } from './components/PrivateRoute';
import { BatchScarico } from './pages/BatchScarico';
import { BatchCarico } from './pages/BatchCarico';
import { RicercaPerTitolo, RicercaPerGenere } from './pages/RicercaVideo';
import { Noleggio } from './pages/Noleggio';
import { TerminaNoleggio } from './pages/TerminaNoleggio';
import { StatisticheDipendente } from './pages/StatisticheDipendente';
import { Container } from 'reactstrap';
import { Header } from './components/Header';
import { DisplayRicevuta } from './pages/DisplayRicevuta';
import { RicercaCliente } from './pages/RicercaCliente';
import { DettagliCliente } from './pages/DettagliCliente';
import { NuovoCliente } from './pages/NuovoCliente';
import { NotFound } from './pages/NotFound';
import { Homepage } from './pages/Home';
import { PrenotaVideo } from './pages/PrenotaVideo';
import { StatistichePuntoVendita } from './pages/StatistichePuntoVendita';


function App() {
  return (

    <Router basename="/noleggio/webapp">
    <GlobalContextProvider>
      <Container>
        <Header/>
        <Switch>
          <Route exact path="/login" component={Login}/>
          <PrivateRoute exact path="/" component={Homepage}/>
          <PrivateRoute path="/batch/scarico" component={BatchScarico}/>
          <PrivateRoute path="/batch/carico" component={BatchCarico}/>
          <PrivateRoute exact path="/ricerca/titolo" component={RicercaPerTitolo}/>
          <PrivateRoute exact path="/ricerca/genere" component={RicercaPerGenere}/>
          <PrivateRoute exact path="/ricerca/cliente" component={RicercaCliente}/>
          <PrivateRoute path="/noleggio/attiva" component={Noleggio}/>
          <PrivateRoute path="/noleggio/termina"component={TerminaNoleggio}/>
          <PrivateRoute path="/prenotazione"component={PrenotaVideo}/>
          <PrivateRoute path="/ricevuta/:id" render={(props) => <DisplayRicevuta id={props.match.params.id}/>}/>
          <PrivateRoute path="/nuovo-cliente" component={NuovoCliente}/>
          <PrivateRoute path="/cliente/:cod_fiscale" render={(props) => <DettagliCliente cod_fiscale={props.match.params.cod_fiscale}/>}/>
          <PrivateRoute path="/statistiche/dipendente" component={StatisticheDipendente}/>
          <PrivateRoute path="/statistiche/punto-vendita" component={StatistichePuntoVendita}/>
          <Route path="*" component={NotFound}/>
        </Switch>
      </Container>
    </GlobalContextProvider>
    </Router>
  );
}

export default App;
