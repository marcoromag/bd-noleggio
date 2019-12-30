import React from 'react'
import {Container} from 'reactstrap'
import { Header } from './Header'

interface LayoutProps {
    menu? : React.ReactElement
}

export const Layout : React.FC<LayoutProps> = ({children}) => {

    return (
        <Container>
            <Header/>
            {children}
        </Container>

    )
}