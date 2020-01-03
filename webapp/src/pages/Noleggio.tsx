import * as React from 'react'
import {  Row, Col, Button, Table, CardHeader, Card, CardBody, FormGroup, FormText, Label } from 'reactstrap';
import VideoAPI, { Video, Supporto } from '../api/VideoAPI';
import { Cliente } from '../api/ClienteAPI';
import ConfigAPI, { TermineNoleggio } from '../api/ConfigAPI';
import { Loading } from '../components/Loading';
import NoleggioAPI from '../api/NoleggioAPI';
import { SelezionaVideoPerTitolo } from '../components/SelezionaVideo';
import { SelezionaCliente } from '../components/SelezionaCliente';
import { Layout } from '../components/Layout';
import { Steps } from '../components/Steps';


const SelezionaSupporto: React.FC<{video: string, onSelect: (supporto: Supporto) => void}> = ({video,onSelect}) => {
    const [listaSupporti, setListaSupporti] = React.useState<Supporto[]>();
    React.useEffect( ()=>{
        VideoAPI.listaSupporti(video).then (l => {
            setListaSupporti(l);
        });
    },[video])

    return (listaSupporti && listaSupporti.length) ?
        <Col xs="12">
            <Table>
                <thead>
                    <tr>
                        <th>ID Supporto</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {listaSupporti.map( c => 
                        <tr key={c.id}>
                            <td>{c.id}</td>
                            <td><Button onClick={() => onSelect(c)}>Seleziona</Button></td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Col>
        :<p>Nessun supporto</p>
}

const SelezionaTermineNoleggio : React.FC<{onSelect: (tn: TermineNoleggio) => void}> = ({onSelect}) => {

    const [listaTerminiNoleggio, setlistaTerminiNoleggio] = React.useState<TermineNoleggio[]>();
    React.useEffect( ()=>{
        ConfigAPI.listaTermini().then (l => {
            setlistaTerminiNoleggio(l);
        });
    },[])

    return listaTerminiNoleggio ? <>
        {listaTerminiNoleggio.map(t => 
        <Col key={t.giorni} xs="12" sm="6" md="4">
            <Card>
                <CardHeader>
                    {t.giorni} giorni
                </CardHeader>
                <CardBody>
                    <p><strong>Costo fisso:</strong> {t.importo_iniziale}</p>
                    <p><strong>Costo per ogni giorno successivo:</strong> {t.importo_gg_successivi}</p>
                    <Button onClick={() => onSelect(t)}>Seleziona</Button>
                </CardBody>
            </Card>
        </Col>  
        )}</> 
        : <Loading/>
}



const MostraDati: React.FC<{cliente?: Cliente, video?: Video, supporto?: Supporto, termine?: TermineNoleggio}> = ({cliente, video, supporto, termine}) => {

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
            <FormGroup>
                <FormText>Supporto</FormText>
                <Label>{supporto ? supporto.id: "-"}</Label>
            </FormGroup>
            <FormGroup>
                <FormText>Termine</FormText>
                <Label>{termine ? `${termine.giorni} giorno`: "-"}</Label>
            </FormGroup>
        </CardBody>
    </Card>

}



const titoloStep = [
    'Seleziona il cliente',
    'Seleziona il video',
    'Seleziona il supporto',
    'Seleziona il termine di noleggio',
    'Conferma i dati di noleggio',
    'Completato'
]

export const Noleggio : React.FC = () => {
    const [error, setError] = React.useState<string>()
    const [step,setStep] = React.useState(0);
    const [cliente, setCliente] = React.useState<Cliente>();
    const [video, setVideo] = React.useState<Video>();
    const [supporto, setSupporto] = React.useState<Supporto>();
    const [idNoleggio, setIdNoleggio] = React.useState<string>();
    const [termineNoleggio, setTermineNoleggio] = React.useState<TermineNoleggio>();



    const selezionaCliente = React.useCallback( (cliente:Cliente) => {
        setCliente(cliente);
        setStep(1);
    },[]);

    const selezionaVideo = React.useCallback( (video:Video) => {
        setVideo(video);
        setStep(2);
    },[]);

    const selezionaSupporto = React.useCallback( (supporto:Supporto) => {
        setSupporto(supporto);
        setStep(3);
    },[]);

    const selezionaTermineNoleggio = React.useCallback( (tn:TermineNoleggio) => {
        setTermineNoleggio(tn);
        setStep(4);
    },[]);

    //resetta i dati quando si torna indietro
    React.useEffect( () => {
        switch (step) {
            case 0: setCliente(undefined)
            case 1: setVideo(undefined)
            case 2: setSupporto(undefined);
            case 3: setTermineNoleggio(undefined);
        }
    },[step])

    const confermaNoleggio = React.useCallback( async () => {
        try {
            setError(undefined);
            const id_noleggio = await NoleggioAPI.attiva(cliente!.cod_fiscale, termineNoleggio!.giorni, supporto!.id);
            setIdNoleggio(id_noleggio);
            setStep(5);
        } catch (e) {
            setError (e.message);
        }
    },[cliente, termineNoleggio, supporto]);
    
    return <Layout titolo="Attiva noleggio" errore={error}
        headline="Da questa pagina potrai attivare un nuovo noleggio. Segui gli step indicati sotto, fino al completamento. Alla fine del processo riceverai il codice del noleggio attivato"
    >
        <Steps xs="12" className="mb-4" steps={titoloStep} corrente={step} stepClick={setStep}/>
        <Col xs="8" sm="8">
            <Row>
            {step === 0 && <SelezionaCliente onSelect={selezionaCliente}/>}
            {step === 1 && <SelezionaVideoPerTitolo onSelect={selezionaVideo} conDisponibilita="DISPONIBILE" /> }
            {step === 2 && <SelezionaSupporto video={video!.id} onSelect={selezionaSupporto}/>}
            {step === 3 && <SelezionaTermineNoleggio onSelect={selezionaTermineNoleggio}/>}
            {step === 4 && <Col xs="12"><Button onClick={confermaNoleggio}>Conferma il noleggio</Button></Col>}
            {step === 5 && <Col xs="12">Noleggio confermato con ID {idNoleggio}</Col>}
            </Row>
        </Col>
        <Col xs="12" sm="4">
            <MostraDati cliente={cliente} video={video} supporto={supporto} termine={termineNoleggio}/>
        </Col>
    </Layout>


}