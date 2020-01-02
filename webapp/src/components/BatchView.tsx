import * as React from 'react'
import { Row, Col, Table, Card, CardBody } from 'reactstrap'
import { Batch } from '../api/BatchAPI'

export const BatchView : React.FC<{batch: Batch}> = ({batch}) => {
    return  <>
            <Col xs="6" sm="3">Batch id</Col>
            <Col xs="6" sm="9">{batch.batch_id}</Col>

            <Col xs="6" sm="3">Tipo</Col>
            <Col xs="6" sm="9">{batch.tipo}</Col>

            <Col xs="6" sm="3">Esito</Col>
            <Col xs="6" sm="9">{batch.esito}</Col>

            <Col xs="6" sm="3">Data</Col>
            <Col xs="6" sm="9">{batch.data}</Col>

            <Col xs="6" sm="3">Impiegato</Col>
            <Col xs="6" sm="9">{batch.impiegato}</Col>
            <Col xs="12"><h2>Supporti</h2></Col>
            <Col xs="12">
            <Table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Seriale</th>
                        <th>Video</th>
                        <th>Fornitore</th>
                        <th>Data Carico</th>
                        <th>Data Scarico</th>
                        <th>Stato fisico</th>
                    </tr>
                </thead>
                <tbody>
                    {batch.supporti && batch.supporti.map( s => 
                        <tr key={s.id}>
                            <th>{s.id}</th>
                            <td>{s.seriale}</td>
                            <td>{s.video}</td>
                            <td>{s.fornitore}</td>
                            <td>{s.data_carico}</td>
                            <td>{s.data_scarico}</td>
                            <td>{s.stato_fisico}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            </Col>
        </>
        
}
