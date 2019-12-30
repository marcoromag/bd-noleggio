import * as React from 'react'
import { Container, Row, Col, Form, FormGroup, Input, Label, Button, Table, CardHeader, Card, CardBody } from 'reactstrap';
import { DisplayError } from '../components/DisplayError';
import VideoAPI, { Video, Supporto } from '../api/VideoAPI';
import ClienteAPI, { Cliente } from '../api/ClienteAPI';
import ConfigAPI, { TermineNoleggio } from '../api/ConfigAPI';
import { Loading } from '../components/Loading';
import NoleggioAPI from '../api/NoleggioAPI';
import { SelezionaVideoPerTitolo } from '../components/SelezionaVideoPerTitolo';

const SelezionaCliente : React.FC<{onSelect: (cliente: Cliente) => void}> = ({onSelect}) => {

    const [query, setQuery] = React.useState({nome:'', cognome:''});
    const [listaClienti, setListaClienti] = React.useState<Cliente[]>()
    const changeNome = React.useCallback( (e : React.ChangeEvent<HTMLInputElement>) => setQuery({...query, nome: e.target.value}), [query])
    const changeCognome = React.useCallback( (e : React.ChangeEvent<HTMLInputElement>) => setQuery({...query, cognome: e.target.value}), [query])
    const startBatch = React.useCallback( async ()=>{
        const lista = await ClienteAPI.ricerca(query.nome, query.cognome);
        setListaClienti(lista);
    },[query])

return <>
    <Col xs="12">
        <Form>
            <FormGroup>
                <Label>Cognome</Label>
                <Input type="text" onChange={changeNome}/>
            </FormGroup>
            <FormGroup>
                <Label>Nome</Label>
                <Input type="text" onChange={changeCognome}/>
            </FormGroup>
            <FormGroup>
                <Button disabled={!query.nome && !query.cognome } onClick={startBatch}>Avvia esecuzione</Button>
            </FormGroup>
        </Form>
    </Col>
    {listaClienti && 
    <Col xs="12">
        <Table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Cognome</th>
                    <th>Codice fiscale</th>
                    <th>Telefono abitazione</th>
                    <th>Telefono cellulare</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {listaClienti.map( c => 
                    <tr key={c.cod_fiscale}>
                        <td>{c.nome}</td>
                        <td>{c.cognome}</td>
                        <td>{c.cod_fiscale}</td>
                        <td>{c.telefono_abitazione}</td>
                        <td>{c.telefono_cellulare}</td>
                        <td><Button onClick={() => onSelect(c)}>Seleziona</Button></td>
                    </tr>
                )}
            </tbody>
        </Table>
    </Col>
    }
    </>
}

const SelezionaSupporto: React.FC<{video: string, onSelect: (supporto: Supporto) => void}> = ({video,onSelect}) => {
    const [listaSupporti, setListaSupporti] = React.useState<Supporto[]>();
    React.useEffect( ()=>{
        VideoAPI.listaSupporti(video).then (l => {
            setListaSupporti(l);
        });
    })

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
    })

    return listaTerminiNoleggio ? <>
        {listaTerminiNoleggio.map(t => 
        <Col xs="3">
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

const MostraTermineNoleggio : React.FC<{termine: TermineNoleggio}> = ({termine}) => {
    return <Col xs="4">
        <Card>
            <CardHeader>
                <h5>Termine di noleggio</h5>
            </CardHeader>
            <CardBody>
            {termine.giorni} giorni
            </CardBody>
        </Card>
    </Col>    
}

const MostraCliente: React.FC<{cliente: Cliente}> =({cliente}) => {
    return <Col xs="4">
        <Card>
            <CardHeader>
                <h5>Cliente</h5>
            </CardHeader>
            <CardBody>
                {cliente.cognome} {cliente.nome}
            </CardBody>
        </Card>
    </Col>
}

const MostraVideo: React.FC<{video: Video}> =({video}) => {
    return <Col xs="4">
        <Card>
            <CardHeader>
                <h5>Video</h5>
            </CardHeader>
            <CardBody>
            {video.titolo}
            </CardBody>
        </Card>
    </Col>
}

const MostraSupporto: React.FC<{supporto: Supporto}> =({supporto}) => {
    return <Col xs="4">
        <Card>
            <CardHeader>
                <h5>Supporto</h5>
            </CardHeader>
            <CardBody>
            {supporto.id}
            </CardBody>
        </Card>
    </Col>
}

const MostraDati: React.FC<{cliente?: Cliente, video?: Video, supporto?: Supporto, termine?: TermineNoleggio}> = ({cliente, video, supporto, termine}) => {
    return <Row>
        {cliente && <MostraCliente cliente={cliente}/>}
        {video && <MostraVideo video={video}/>}
        {supporto && <MostraSupporto supporto={supporto}/>}
        {termine && <MostraTermineNoleggio termine={termine}/>}
    </Row>
}

const titoloStep = [
    'step 1: seleziona il cliente',
    'step 2: seleziona il video',
    'step 3: seleziona il supporto',
    'step 4: seleziona il termine di noleggio',
    'step 5: conferma i dati di noleggio',
    'completato'
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
    
    return <Container>
        <Row>
            <Col xs="12"><h1>Noleggio {titoloStep[step]}</h1></Col>
            <Col xs="12">
                <DisplayError error={error}/>
            </Col>
        </Row>
        <MostraDati cliente={cliente} video={video} supporto={supporto} termine={termineNoleggio}/>
        {step === 0 && 
        <Row>
            <SelezionaCliente onSelect={selezionaCliente}/> 
        </Row>}
        {step === 1 && 
        <Row>
            <SelezionaVideoPerTitolo onSelect={selezionaVideo}/> 
        </Row>
        }
        {step === 2 && 
        <Row>
            <SelezionaSupporto video={video!.id} onSelect={selezionaSupporto}/>
        </Row>
        }
        {step === 3 && 
        <Row>
            <SelezionaTermineNoleggio onSelect={selezionaTermineNoleggio}/>
        </Row>
        }
        {step === 4 && 
        <Row>
            <Col xs="12"><Button onClick={confermaNoleggio}>Conferma il noleggio</Button></Col>
        </Row>
        }
        {step === 5 && 
        <Row>
            <Col xs="12">Noleggio confermato con ID {idNoleggio}</Col>
        </Row>
        }
    </Container>


}