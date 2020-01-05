import * as React from 'react'
import ClienteAPI, { Cliente } from '../api/ClienteAPI'
import NoleggioAPI, { Noleggio } from '../api/NoleggioAPI';
import { Layout } from '../components/Layout';
import { Col, FormGroup, FormText, Label, Button, Alert, Input } from 'reactstrap';
import DatePicker from 'react-date-picker';
import { useHistory } from 'react-router';
import styles from './DettagliCliente.module.scss'
import { Video } from '../api/VideoAPI';
import { VideoView } from '../components/SelezionaVideo';


const MostraNoleggio : React.FC<{noleggio: Noleggio}> = ({noleggio}) => {
    const isTermine = !!noleggio.data_restituzione
    const history = useHistory();

    const mostraRicevuta = React.useCallback ( async () => {
        noleggio.ricevuta && history.push(`/ricevuta/${noleggio.ricevuta}`);
    },[noleggio,history]);

    return <>
    <Col xs="6" sm="3">                       
        <FormGroup>
            <FormText>Id</FormText>
            <Label>{noleggio.id}</Label>
        </FormGroup> 
    </Col>
    <Col xs="6" sm="3">     
        <FormGroup>
            <FormText>supporto</FormText>
            <Label>{noleggio.supporto}</Label>
        </FormGroup>  
    </Col>
    <Col xs="6" sm="3">     
        <FormGroup>
            <FormText>Data inizio</FormText>
            <Label>{noleggio.data_inizio}</Label>
        </FormGroup>  
    </Col>
    {isTermine ?<Col xs="6" sm="3">     
        <FormGroup>
            <FormText>Data restituzione</FormText>
            <Label>{noleggio.data_restituzione}</Label>
        </FormGroup>  
    </Col>
    : null
    }
    <Col xs="12" sm>     
        <FormGroup>
            <FormText>Titolo</FormText>
            <Label>{noleggio.titolo}</Label>
        </FormGroup>  
    </Col>
    {isTermine ? <Col xs="12" sm="auto">
        <FormText>Ricevuta</FormText>
        <Button onClick={mostraRicevuta}>Mostra ricevuta</Button>
    </Col> : null}
    <Col xs="12"><hr/></Col>
    </>
}

const MostraDocumentoLiberatoria : React.FC<{cliente: Cliente}> = ({cliente}) => {

    return <>
    <Col xs="12" sm="4">
        <FormGroup>
            <FormText>ID Documento</FormText>
            <Label>{cliente.documento_liberatoria}</Label>
        </FormGroup>
    </Col>
    <Col xs="12" sm="4">                       
        <FormGroup>
            <FormText>Data sottoscrizione</FormText>
            <Label>{cliente.data_sottoscrizione}</Label>
        </FormGroup>       
    </Col>
    <Col  xs="12" sm="4">                
        <FormGroup>
            <FormText>Posizione in archivio</FormText>
            <Label>{cliente.posizione_archivio}</Label>
        </FormGroup>  
    </Col>
</>
}

export const CreaDocumentoLiberatoria : React.FC<{cliente: Cliente, setError?: (e:string) => void, onDocumento?: (id: string) => void}> = ({cliente,setError, onDocumento}) => {
    const [idDoc, setIdDoc] = React.useState<string>()
    const [posizione, setPosizione] = React.useState<string>()
    const [dataSottoscrizione, setDataSottoscrizione] = React.useState<Date>();
    const oggi = React.useMemo( ()=> new Date(), [])
    const changeGiorno = React.useCallback( (d: Date | Date[]) => {
        if (Array.isArray(d)) return;
        setDataSottoscrizione(d);
    },[])

    const aggiungiDocumento = React.useCallback( async () => {
        try {
            const id = await ClienteAPI.creaDocumento(cliente.cod_fiscale, idDoc!,dataSottoscrizione!, posizione!);
            onDocumento && onDocumento(id);
        } catch (e) {
            setError && setError (e.message)
        }
    },[cliente, idDoc, posizione, dataSottoscrizione, setError, onDocumento])



    return <>
            <Col xs="12">
                <Alert><strong>Attenzione</strong>: Il cliente non ha ancora sottoscritto il documento di liberatoria. Senza il documento, non sarà possibile noleggiare alcun titolo</Alert>
            </Col>
            <Col xs="12" sm="4">
                <FormGroup>
                    <FormText>ID Documento</FormText>
                    <Input type="text" value={idDoc} onChange={e=>setIdDoc(e.target.value)}/>
                </FormGroup>
            </Col>
            <Col xs="12" sm="4">                       
                <FormGroup>
                    <FormText>Data sottoscrizione</FormText>
                    <DatePicker className="form-control datepicker_cust" onChange={changeGiorno} value={dataSottoscrizione} maxDate={oggi}/>
                </FormGroup>       
            </Col>
            <Col  xs="12" sm="4">                
                <FormGroup>
                    <FormText>Posizione in archivio</FormText>
                    <Input type="text" value={posizione} onChange={e=>setPosizione(e.target.value)}/>
                </FormGroup>  
            </Col>
            <Col xs="12">
                <Button onClick={aggiungiDocumento}>Aggiungi il documento di liberatoria</Button>
            </Col>
    </>
}


export const DettagliCliente : React.FC<{cod_fiscale:string}> = ({cod_fiscale}) => {

    const [cliente, setCliente] = React.useState<Cliente>();
    const [errore, setErrore] = React.useState<string>();
    const [noleggiAttivi, setNoleggiAttivi] = React.useState<Noleggio[]>();
    const [noleggiTerminati, setNoleggiTerminati] = React.useState<Noleggio[]>();
    const [prenotazioni, setPrenotazioni] = React.useState<Video[]>();

    const caricaCliente = React.useCallback( async () => {
        try {
            setCliente(undefined);
            const c = await ClienteAPI.cliente(cod_fiscale)
            setCliente(c);
        } catch (e) {
            setErrore(e.message)
        }
    },[cod_fiscale])

    React.useEffect( () => {caricaCliente()},[caricaCliente]);

    React.useEffect( () => {
        if(! cliente) {
            setNoleggiAttivi(undefined);
            setNoleggiTerminati(undefined);
            setPrenotazioni(undefined);
            return;
        }
        Promise.all([
            NoleggioAPI.noleggiAttiviPerCliente(cliente.cod_fiscale),
            NoleggioAPI.noleggiTerminatiPerCliente(cliente.cod_fiscale),
            NoleggioAPI.prenotazioniPerCliente(cliente.cod_fiscale)
        ]).then (([attivi,terminati, prenotati]) => {
            setNoleggiAttivi(attivi)
            setNoleggiTerminati(terminati)
            setPrenotazioni(prenotati)
        }).catch(e => {setErrore(e.message)})
      
    },[cliente])

    return <Layout titolo="Dettagli cliente" errore={errore} className={styles.cliente}>
        {cliente && <>
        <Col xs="12">
            <h4>Dati anagrafici</h4>
        </Col>
        <Col xs="6" md="3">
            <FormGroup>
                <FormText>Nome</FormText>
                <Label>{cliente.nome}</Label>
            </FormGroup>
        </Col>
        <Col xs="6" md="4">
            <FormGroup>
                <FormText>Cognome</FormText>
                <Label>{cliente.cognome}</Label>
            </FormGroup>
        </Col>
        <Col xs="12" md="3">
            <FormGroup>
                <FormText>Codice fiscale</FormText>
                <Label>{cliente.cod_fiscale}</Label>
            </FormGroup>
        </Col>
        <Col xs="12" md="2">
            <FormGroup>
                <FormText>Data di nascita</FormText>
                <Label>{cliente.data_nascita}</Label>
            </FormGroup>
        </Col>

        <Col xs="12" sm="12">
            <FormGroup>
                <FormText>Indirizzo</FormText>
                <Label>{cliente.indirizzo}</Label>
            </FormGroup>
        </Col>
        <Col xs="6" sm="6">
            <FormGroup>
                <FormText>Città</FormText>
                <Label>{cliente.citta}</Label>
            </FormGroup>
        </Col>
        <Col xs="6" sm="6">
            <FormGroup>
                <FormText>Cap</FormText>
                <Label>{cliente.cap}</Label>
            </FormGroup>
        </Col>
        <Col xs="12" className="mt-4">
            <h4>Dati di contatto</h4>
        </Col>
        <Col xs="6" sm="4">
            <FormGroup>
                <FormText>Telefono abitazione</FormText>
                <Label>{cliente.telefono_abitazione}</Label>
            </FormGroup>
        </Col>
        <Col xs="6" sm="4">
            <FormGroup>
                <FormText>Telefono cellulare</FormText>
                <Label>{cliente.telefono_cellulare}</Label>
            </FormGroup>
        </Col>
        <Col xs="6" sm="4">
            <FormGroup>
                <FormText>E-mail</FormText>
                <Label>{cliente.email}</Label>
            </FormGroup>
        </Col>
        <Col xs="12" className="mt-4">
            <h4>Documento di liberatoria</h4>
        </Col>
        {cliente.data_sottoscrizione ? 
            <MostraDocumentoLiberatoria cliente={cliente}/>
        : 
            <CreaDocumentoLiberatoria cliente={cliente} setError={setErrore} onDocumento={caricaCliente}/>
        }
        <Col xs="12" className="mt-4">
            <h4>Noleggi attivi</h4>
        </Col>

        {noleggiAttivi && noleggiAttivi.length ? 
            noleggiAttivi.map(n => <MostraNoleggio key={n.id} noleggio={n}/>) 
            : <Col xs="12">
                <Alert color="info">Nessun noleggio attivo</Alert>
            </Col>
        }

        <Col xs="12" className="mt-4">
            <h4>Noleggi terminati</h4>
        </Col>
        {noleggiTerminati && noleggiTerminati.length ?
            noleggiTerminati.map(n => <MostraNoleggio key={n.id} noleggio={n}/>)  
            : <Col xs="12">
                <Alert color="info">Nessun noleggio terminato</Alert>
            </Col>
        }
        <Col xs="12" className="mt-4">
            <h4>Prenotazioni</h4>
        </Col>
        {prenotazioni && prenotazioni.length ?
            prenotazioni.map(v => <VideoView key={v.id} video={v}/>)  
            :<Col xs="12">
                <Alert color="info">Nessuna prenotazione attiva</Alert>
            </Col>
        }

    </>
    }
    </Layout>



}