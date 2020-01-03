import * as React from 'react'
import {  Row, Col, Button,  CardHeader, Card, CardBody, FormGroup, FormText, Label } from 'reactstrap';
import { Video } from '../api/VideoAPI';
import { Cliente } from '../api/ClienteAPI';

import NoleggioAPI from '../api/NoleggioAPI';
import { SelezionaVideoPerTitolo } from '../components/SelezionaVideo';
import { SelezionaCliente } from '../components/SelezionaCliente';
import { Layout } from '../components/Layout';
import { Steps } from '../components/Steps';
import { Link } from 'react-router-dom';

const MostraDati: React.FC<{cliente?: Cliente, video?: Video}> = ({cliente, video}) => {

    return <Card>
        <CardHeader>
            Selezione corrente
        </CardHeader>
        <CardBody>
            <FormGroup>
                <FormText>Cliente</FormText>
                <Label>{cliente ? `${cliente.nome} ${cliente.cognome}`: "-"}</Label>
            </FormGroup>
            <FormGroup>
                <FormText>Video</FormText>
                <Label>{video ? video.titolo: "-"}</Label>
            </FormGroup>
        </CardBody>
    </Card>

}

const titoloStep = [
    'Seleziona il cliente',
    'Seleziona il video',
    'Conferma la prenotazione',
    'Completato'
]

export const PrenotaVideo : React.FC = () => {
    const [error, setError] = React.useState<string>()
    const [step,setStep] = React.useState(0);
    const [cliente, setCliente] = React.useState<Cliente>();
    const [video, setVideo] = React.useState<Video>();

    const selezionaCliente = React.useCallback( (cliente:Cliente) => {
        setCliente(cliente);
        setStep(1);
    },[]);

    const selezionaVideo = React.useCallback( (video:Video) => {
        setVideo(video);
        setStep(2);
    },[]);

    //resetta i dati quando si torna indietro
    React.useEffect( () => {
        switch (step) {
            case 0: setCliente(undefined)
            case 1: setVideo(undefined)
        }
    },[step])

    const confermaPrenotazione = React.useCallback( async () => {
        try {
            setError(undefined);
            await NoleggioAPI.prenotazione(cliente!.cod_fiscale, video!.id);
            setStep(3);
        } catch (e) {
            setError (e.message);
        }
    },[cliente, video]);
    
    return <Layout titolo="Prenota un video" errore={error}
        headline="Da questa pagina potrai prenotare un video non acora disponbile per un cliente."
    >
        <Steps xs="12" className="mb-4" steps={titoloStep} corrente={step} stepClick={setStep}/>
        <Col xs="8" sm="8">
            <Row>
            {step === 0 && <SelezionaCliente onSelect={selezionaCliente}/>}
            {step === 1 && <SelezionaVideoPerTitolo onSelect={selezionaVideo} conDisponibilita="NON-DISPONIBILE" /> }
            {step === 2 && <Col xs="12"><Button onClick={confermaPrenotazione}>Conferma la prenotazione</Button></Col>}
            {step === 3 && <Col xs="12">Prenotazione eseguita. Vai al <Link to={`/cliente/${cliente!.cod_fiscale}`}>dettaglio cliente</Link> per vedere i dettagli</Col>}
            </Row>
        </Col>
        <Col xs="12" sm="4">
            <MostraDati cliente={cliente} video={video}/>
        </Col>
    </Layout>


}