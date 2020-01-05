import * as React from 'react'
import { Layout } from '../components/Layout'
import { Table, Col, Alert, Button } from 'reactstrap'
import BatchAPI, { Batch } from '../api/BatchAPI'
import { Loading } from '../components/Loading'
import { useHistory } from 'react-router'

export const ListaBatch: React.FC = () => {
    const [lista, setLista] = React.useState<Batch[]>();
    const [errore, setErrore] = React.useState<string>();
    const push = useHistory().push;
    
    React.useEffect( () => {
        BatchAPI.lista()
        .then(setLista)
        .catch(e => setErrore(e.message));
    },[])

    return <Layout titolo="Lista esecuzioni batch" errore={errore}>
        {!lista && <Loading/>}
        {lista && !lista.length &&
        <Alert color="info">Nessun batch eseguito</Alert>}
        {lista && lista.length &&
        <Col xs="12">
            <Table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>tipo</th>
                        <th>data</th>
                        <th>esito</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {lista.map( s => 
                        <tr key={s.batch_id}>
                            <th>{s.batch_id}</th>
                            <td>{s.tipo}</td>
                            <td>{s.data}</td>
                            <td>{s.esito}</td>
                            <td><Button onClick={() => {push(`/batch/${s.batch_id}`)}}>Dettagli</Button></td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Col>
        }
    </Layout>
}