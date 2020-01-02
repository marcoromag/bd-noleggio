import * as React from 'react'
import { Container, Row, Col, Button, Table, Input, FormGroup, Label} from 'reactstrap';
import { DisplayError } from '../components/DisplayError';
import { Cliente } from '../api/ClienteAPI';
import { Loading } from '../components/Loading';
import NoleggioAPI, { NoleggioAttivo, StatoSupporto } from '../api/NoleggioAPI';
import { SelezionaCliente } from '../components/SelezionaCliente';
import { MostraCliente, MostraNoleggio } from '../components/MostraDati';
import { Steps } from '../components/Steps';
import { Layout } from '../components/Layout';


const SelezionaNoleggioPerCliente : React.FC<{cod_fiscale: string, onSelect: (na: NoleggioAttivo) => void}> = ({cod_fiscale,onSelect}) => {

    const [listaNoleggiAttivi, setListaNoleggiAttivi] = React.useState<NoleggioAttivo[]>();
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
                    <td>{n.data_fine}</td>
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

const MostraDati: React.FC<{cliente?: Cliente, noleggio?: NoleggioAttivo}> = ({cliente, noleggio}) => {
    return (cliente || noleggio) ?
    <Col xs="12">
        <Row className="bg-warning p-3 align-items-stretch mb-4">
            {cliente && <Col xs="12" sm="6"><MostraCliente cliente={cliente}/></Col>}
            {noleggio && <Col xs="12" sm="6"><MostraNoleggio noleggio={noleggio}/></Col>}
        </Row>
    </Col>
    : null
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
    const [noleggio, setNoleggio] = React.useState<NoleggioAttivo>();
    const [costo, setCosto] = React.useState<number>();

    const selezionaCliente = React.useCallback( (cliente:Cliente) => {
        setCliente(cliente);
        setStep(1);
    },[]);

    const selezionaNoleggio = React.useCallback( (n:NoleggioAttivo) => {
        setNoleggio(n);
        setStep(2);
    },[]);

    const selezionaStatoSupporto = React.useCallback( async (stato:StatoSupporto) => {
        try {
            setError(undefined);
            const costo = await NoleggioAPI.termina(noleggio!.id, stato);
            setCosto(costo);
            setStep(3);
        } catch (e) {
            setError (e.message);
        }
    },[noleggio]);

    //resetta i dati quando si torna indietro
    React.useEffect( () => {
        switch (step) {
            case 0: setCliente(undefined)
            case 1: setNoleggio(undefined)
        }
    },[step])

    return <Layout titolo="Termina noleggio" errore={error}>
        <Steps steps={titoloStep} corrente={step} stepClick={setStep}/>
        <MostraDati cliente={cliente} noleggio={noleggio}/>
        {step === 0 && <SelezionaCliente onSelect={selezionaCliente}/>}
        {step === 1 && <SelezionaNoleggioPerCliente cod_fiscale={cliente!.cod_fiscale} onSelect={selezionaNoleggio}/> }
        {step === 2 && <SelezionaStatoSupporto onSelect={selezionaStatoSupporto}/>}
        {step === 3 && <Col xs="12"><p>Noleggio completato. Costo: {costo}</p></Col>}
    </Layout>
  



}