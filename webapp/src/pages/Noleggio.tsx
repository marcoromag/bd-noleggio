import * as React from 'react'
import { Container, Row, Col, Button, Table, CardHeader, Card, CardBody } from 'reactstrap';
import { DisplayError } from '../components/DisplayError';
import VideoAPI, { Video, Supporto } from '../api/VideoAPI';
import { Cliente } from '../api/ClienteAPI';
import ConfigAPI, { TermineNoleggio } from '../api/ConfigAPI';
import { Loading } from '../components/Loading';
import NoleggioAPI from '../api/NoleggioAPI';
import { SelezionaVideoPerTitolo } from '../components/SelezionaVideoPerTitolo';
import { SelezionaCliente } from '../components/SelezionaCliente';
import { MostraCliente, MostraVideo, MostraTermineNoleggio, MostraSupporto } from '../components/MostraDati';


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



const MostraDati: React.FC<{cliente?: Cliente, video?: Video, supporto?: Supporto, termine?: TermineNoleggio}> = ({cliente, video, supporto, termine}) => {
    return (cliente || video || supporto || termine) ? <Row className="bg-warning p-3 align-items-stretch mb-4">
        {cliente && <Col xs="12" sm="4"><MostraCliente cliente={cliente}/></Col>}
        {video && <Col xs="12" sm="4"><MostraVideo video={video}/></Col>}
        {supporto && <Col xs="12" sm="4"><MostraSupporto supporto={supporto}/></Col>}
        {termine && <Col xs="12" sm="4"><MostraTermineNoleggio termine={termine}/></Col>}
    </Row>
    : null
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