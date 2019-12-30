import React from 'react'
import {Container, Row, Col} from 'reactstrap'
import { Header } from './Header'

interface LayoutProps {
    menu? : React.ReactElement
}

export const Layout : React.FC<LayoutProps> = ({menu, children}) => {

    return (
        <Container>
            <Row className="bg-primary text-white" >
                <Header/>
            </Row>
            <Row>
                {menu &&
                    <Col xs="12" sm="3" className="bg-primary text-white">
                        {menu}
                    </Col>
                }
                <Col xs="12" sm={menu ? "9": "12"}>
                    {children}
                </Col>
            </Row>
        </Container>

    )
}