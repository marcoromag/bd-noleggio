import * as React from 'react';
import { Layout } from '../components/Layout';
import NoleggioAPI, { Ricevuta } from '../api/NoleggioAPI';
import { Col } from 'reactstrap';
import styles from './DisplayRicevuta.module.scss'

export const DisplayRicevuta : React.FC<{id: string}> = ({id}) => {
    const [ricevuta, setRicevuta] = React.useState<Ricevuta>();
    const [error, setError] = React.useState<string>()

    React.useEffect( () => {
     NoleggioAPI.ricevuta(id)
        .then (setRicevuta) 
        .catch (e => setError(e.message))
    },[id])


    return <Layout titolo={`Ricevuta`} errore={error} className={styles.ricevuta}>
        {ricevuta && <>
            <Col xs="12">
                <h5>Dati ricevuta</h5>
            </Col>
            <Col xs="4"><h6>Numero ricevuta</h6></Col>
            <Col xs="8">{id}</Col>
            <Col xs="4"><h6>Data</h6></Col>
            <Col xs="8">{}</Col>
            <Col xs="4"><h6>Totale</h6></Col>
            <Col xs="8">{ricevuta.totale}</Col>
            <Col xs="12">
                <h5>Cliente</h5>
            </Col>
            <Col xs="4"><h6>Cliente</h6></Col>
            <Col xs="8">{ricevuta.nome} {ricevuta.cognome}</Col>
            <Col xs="4"><h6>Codice fiscale</h6></Col>
            <Col xs="8">{ricevuta.cliente}</Col>
            <Col xs="4"><h6>Indirizzo></h6></Col>
            <Col xs="8">{ricevuta.indirizzo}</Col>
            <Col xs="4"><h6>Città</h6></Col>
            <Col xs="8">{ricevuta.citta}</Col>
            <Col xs="4"><h6>CAP</h6></Col>
            <Col xs="8">{ricevuta.cap}</Col>
            <Col xs="12">
                <h5>Servito da</h5>
            </Col>
            <Col xs="4"><h6>Matricola</h6></Col>
            <Col xs="8">{ricevuta.matricola}</Col>
            <Col xs="4"><h6>Nome</h6></Col>
            <Col xs="8">{ricevuta.impiegato_nome} {ricevuta.impiegato_cognome}</Col>
            <Col xs="12">
                <hr/>
            </Col>
            <Col xs="12">
                <h5>Dettaglio</h5>
            </Col>
            {ricevuta.dettagli.map(d => <>
                <Col xs="8"><h6>{d.descrizione}</h6></Col>
                <Col xs="4">{d.costo}</Col>
            </>
            )}

        </>
        }
    </Layout>
}