import * as React from 'react';
import { Layout } from '../components/Layout';
import NoleggioAPI, { Ricevuta } from '../api/NoleggioAPI';
import { Table, Col } from 'reactstrap';
import { DisplayError } from '../components/DisplayError';

export const DisplayRicevuta : React.FC<{id: string}> = ({id}) => {
    const [ricevuta, setRicevuta] = React.useState<Ricevuta>();
    const [error, setError] = React.useState<string>()

    React.useEffect( () => {
     NoleggioAPI.ricevuta(id)
        .then (setRicevuta) 
        .catch (e => setError(e.message))
    },[id])


    return <Layout titolo={`Ricevuta ${id}`} errore={error}>
        {ricevuta && <>
            <Col xs="12">
                <h5>Cliente</h5>
            </Col>
            <Col xs="12">
                <Table>
                    <tbody>
                        <tr>
                            <th>Cliente</th><td>{ricevuta.nome} {ricevuta.cognome}</td>
                        </tr>
                        <tr>
                            <th>Codice fiscale</th><td>{ricevuta.cliente}</td>
                        </tr>
                        <tr>
                            <th>indirizzo</th><td>{ricevuta.indirizzo}</td>
                        </tr>
                        <tr>
                            <th>città</th><td>{ricevuta.citta}</td>
                        </tr>
                        <tr>
                            <th>cap</th><td>{ricevuta.cap}</td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
            <Col xs="12">
                <h5>Servito da</h5>
            </Col>
            <Col xs="12">
                <Table>
                    <tbody>
                        <tr>
                            <th>impiegato</th><td>{ricevuta.impiegato_nome} {ricevuta.impiegato_cognome}</td>
                        </tr>
                        <tr>
                            <th>matricola</th><td>{ricevuta.matricola}</td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
        </>
        }
    </Layout>
}