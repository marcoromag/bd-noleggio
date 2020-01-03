import * as React from 'react'
import { Row, Col, Button, Table, Input, FormGroup, Label, Card, CardHeader, CardBody, FormText} from 'reactstrap';
import { Cliente } from '../api/ClienteAPI';
import { Loading } from '../components/Loading';
import NoleggioAPI, { Noleggio, StatoSupporto } from '../api/NoleggioAPI';
import { SelezionaCliente } from '../components/SelezionaCliente';
import { MostraCliente, MostraNoleggio } from '../components/MostraDati';
import { Steps } from '../components/Steps';
import { Layout } from '../components/Layout';
import { useHistory } from 'react-router';


const SelezionaNoleggioPerCliente : React.FC<{cod_fiscale: string, onSelect: (na: Noleggio) => void}> = ({cod_fiscale,onSelect}) => {

    const [listaNoleggiAttivi, setListaNoleggiAttivi] = React.useState<Noleggio[]>();
    React.useEffect( ()=>{
        NoleggioAPI.noleggiAttiviPerCliente(cod_fiscale).then (noleggi => {
            setListaNoleggiAttivi(noleggi);
        })
    },[cod_fiscale])

    return listaNoleggiAttivi ? <Col xs="12">
        <Table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Data inizio</th>
                    <th>Data fine</th>
                    <th>Termine noleggio</th>
                    <th>Titolo</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            {listaNoleggiAttivi.map(n => 
                <tr key={n.id}>
                    <td>{n.data_inizio}</td>
                    <td>{n.data_restituzione}</td>
                    <td>{n.termine_noleggio} giorni</td>
                    <td>{n.titolo}</td>
                    <td><Button onClick={() => onSelect(n)}>Seleziona</Button></td>
                </tr>
            )}
            </tbody>
        </Table>   
    </Col> 
    : <Loading/>
}

const SelezionaStatoSupporto : React.FC<{onSelect: (stato: StatoSupporto) => void}> = ({onSelect}) => {
  const [stato, setStato] = React.useState<StatoSupporto>();
  const changeStato = React.useCallback( (e:React.ChangeEvent<HTMLInputElement>) => {
    setStato(e.target.value as StatoSupporto)
  },[])
  const buttonClick = React.useCallback( () => {
    stato && onSelect(stato);
  },[stato, onSelect])

  return <Col xs="12">
        <FormGroup>
            <Label>Stato del supporto</Label>
            <Input type="select" onChange={changeStato}>   
                {!stato && <option id="">Seleziona</option>}
                <option value="BUONO">Buono stato</option>
                <option value="DANNEGGIATO">Supporto danneggiato</option>
            </Input>
        </FormGroup>
        <FormGroup>
            <Button disabled={!stato} onClick={buttonClick}>Conferma la restituzione del supporto</Button>
        </FormGroup>
    </Col>
  
}

const MostraDati: React.FC<{cliente?: Cliente, noleggio?: Noleggio, statoSupporto?: string}> = ({cliente, noleggio, statoSupporto}) => {
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
                <FormText>Noleggio</FormText>
                <Label>{noleggio ? noleggio.id: "-"}</Label>
            </FormGroup>
            <FormGroup>
                <FormText>Stato supporto</FormText>
                <Label>{statoSupporto || "-"}</Label>
            </FormGroup>
        </CardBody>
    </Card>

}



const titoloStep = [
    'Seleziona il cliente',
    'Seleziona il noleggio',
    'Seleziona lo stato del supporto',
    'Completato'
]

export const TerminaNoleggio : React.FC = () => {
    const [error, setError] = React.useState<string>()
    const [step,setStep] = React.useState(0);
    const [cliente, setCliente] = React.useState<Cliente>();
    const [noleggio, setNoleggio] = React.useState<Noleggio>();
    const [statoSupporto, setStatoSupporto] = React.useState<string>();
    const [ricevuta, setRicevuta] = React.useState<string>();
    const history = useHistory();

    const selezionaCliente = React.useCallback( (cliente:Cliente) => {
        setCliente(cliente);
        setStep(1);
    },[]);

    const selezionaNoleggio = React.useCallback( (n:Noleggio) => {
        setNoleggio(n);
        setStep(2);
    },[]);

    const selezionaStatoSupporto = React.useCallback( async (stato:StatoSupporto) => {
        try {
            setError(undefined);
            setStatoSupporto(stato);
            const ricevuta = await NoleggioAPI.termina(noleggio!.id, stato);
            setRicevuta(ricevuta.id_ricevuta);
            setStep(3);
        } catch (e) {
            setError (e.message);
        }
    },[noleggio]);

    const stampaRicevuta = React.useCallback ( async () => {
        ricevuta && history.push(`/ricevuta/${ricevuta}`);
    },[ricevuta,history])

    //resetta i dati quando si torna indietro
    React.useEffect( () => {
        switch (step) {
            case 0: setCliente(undefined)
            case 1: setNoleggio(undefined)
        }
    },[step])

    return <Layout titolo="Termina noleggio" errore={error}>
        <Steps steps={titoloStep} corrente={step} stepClick={setStep}/>
        
        <Col xs="8" sm="8">
            <Row>
                {step === 0 && <SelezionaCliente onSelect={selezionaCliente}/>}
                {step === 1 && <SelezionaNoleggioPerCliente cod_fiscale={cliente!.cod_fiscale} onSelect={selezionaNoleggio}/> }
                {step === 2 && <SelezionaStatoSupporto onSelect={selezionaStatoSupporto}/>}
                {step === 3 && <>
                    <Col xs="12">
                        <p>Noleggio completato.</p>
                    </Col>
                    <Col xs="12">
                        <Button onClick={stampaRicevuta}>Stampa la ricevuta</Button>
                    </Col></>}
            </Row>
        </Col>
        <Col xs="12" sm="4">
            <MostraDati cliente={cliente} noleggio={noleggio} statoSupporto={statoSupporto}/>
        </Col>
    </Layout>
}