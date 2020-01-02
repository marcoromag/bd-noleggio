import React from 'react'
import {Container, Row, Col} from 'reactstrap'
import { DisplayError } from './DisplayError'

interface LayoutProps {
    titolo?: string
    errore? : string
}

export const Layout : React.FC<LayoutProps> = ({titolo, errore, children}) => {

    return (
    <Container>
            <Row>
                {titolo && <Col xs="12"><h1>{titolo}</h1></Col>}
                {<Col xs="12"><DisplayError error={errore}/></Col>}
            </Row>
            <Row>
                {children}
            </Row>
    </Container>

    )
}