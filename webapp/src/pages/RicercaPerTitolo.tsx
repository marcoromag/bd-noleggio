import * as React from 'react'
import { Container, Row, Col} from 'reactstrap';
import { SelezionaVideoPerTitolo } from '../components/SelezionaVideoPerTitolo';

export const RicercaPerTitolo : React.FC = () => {
    return <Container>
        <Row>
            <Col xs="12"><h1>Ricerca per titolo</h1></Col>
            <SelezionaVideoPerTitolo/>
        </Row>
    </Container>
}