import * as React from 'react'
import { TermineNoleggio } from "../api/ConfigAPI"
import { CardHeader, CardBody, Card } from "reactstrap"
import { Cliente } from "../api/ClienteAPI"
import { Video, Supporto } from '../api/VideoAPI'
import { NoleggioAttivo } from '../api/NoleggioAPI'

export const MostraTermineNoleggio : React.FC<{termine: TermineNoleggio}> = ({termine}) => {
    return <Card>
        <CardHeader>
            <h5>Termine di noleggio</h5>
        </CardHeader>
        <CardBody>
        {termine.giorni} giorni
        </CardBody>
    </Card>

}

export const MostraCliente: React.FC<{cliente: Cliente}> =({cliente}) => {
    return <Card>
        <CardHeader>
            <h5>Cliente</h5>
        </CardHeader>
        <CardBody>
            {cliente.cognome} {cliente.nome}
        </CardBody>
    </Card>
}

export const MostraVideo: React.FC<{video: Video}> =({video}) => {
    return <Card>
        <CardHeader>
            <h5>Video</h5>
        </CardHeader>
        <CardBody>
        {video.titolo}
        </CardBody>
    </Card>
}

export const MostraSupporto: React.FC<{supporto: Supporto}> =({supporto}) => {
    return <Card>
        <CardHeader>
            <h5>Supporto</h5>
        </CardHeader>
        <CardBody>
        {supporto.id}
        </CardBody>
    </Card>
}

export const MostraNoleggio: React.FC<{noleggio: NoleggioAttivo}> =({noleggio}) => {
    return <Card>
        <CardHeader>
            <h5>Noleggio</h5>
        </CardHeader>
        <CardBody>
        {noleggio.id}
        </CardBody>
    </Card>
}