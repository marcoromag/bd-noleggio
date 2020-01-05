import * as React from 'react'
import { Layout } from '../components/Layout'
import { FormGroup, Col, Label, Input, Button } from 'reactstrap';
import ClienteAPI, { Cliente } from '../api/ClienteAPI';
import { useHistory } from 'react-router';
import { InfoMessage } from '../components/Info';
import DatePicker from 'react-date-picker';
import { isodate } from '../api/utils';

const useInput = (field: keyof Cliente, cliente: Cliente, setCliente: (c: Cliente)=>void) => ({
    value: cliente[field],
    onChange: React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setCliente ({...cliente, [field]:e.target.value});
    },[cliente, field, setCliente])
})

export const NuovoCliente : React.FC = () => {
    const history = useHistory();
    const [errore, setErrore] = React.useState<string>();
    const [cliente, setCliente] = React.useState<Cliente>({} as Cliente);
    const inputNome = useInput('nome',cliente, setCliente)
    const inputCognome = useInput('cognome',cliente, setCliente)
    const inputCodFiscale = useInput('cod_fiscale',cliente, setCliente)
    const inputIndirizzo = useInput('indirizzo',cliente, setCliente)
    const inputCitta = useInput('citta',cliente, setCliente)
    const inputCap = useInput('cap',cliente, setCliente)
    const inputTelAbitazione = useInput('telefono_abitazione',cliente, setCliente)
    const inputTelCellulare = useInput('telefono_cellulare',cliente, setCliente)
    const inputEmail = useInput('email',cliente, setCliente)
    const allInput = cliente.nome && cliente.cognome && cliente.cod_fiscale 
        && cliente.indirizzo && cliente.citta && cliente.cap && cliente.email
        && cliente.telefono_abitazione && cliente.telefono_cellulare && cliente.data_nascita
    ;
    const creaCliente = React.useCallback ( async () => {
        try {
            await ClienteAPI.crea(cliente);
            history.push(`/cliente/${cliente.cod_fiscale}`)
        } catch (e) {
            setErrore(e.message)
        }            
    },[cliente, history])

    const changeDataNascita = React.useCallback( (d: Date | Date[]) => {
        if (Array.isArray(d)) return;
        setCliente(c => ({...c, data_nascita:isodate(d)}));
    },[])


    return <Layout titolo="Nuovo cliente" errore={errore}
        headline={<>Crea un nuovo cliente riempiendo questo form. 
        Tutti i dati sono mandatori. 
        Il codice fiscale deve essere unico, altrimenti il cliente non verrà creato.
        Una volta creato il cliente, verrai indirizzato alla pagina di dettaglio, dove
        potrai aggiungere il documento di liberatoria 
        <br/><InfoMessage>Senza documento di liberatoria, il cliente non potrà noleggiare alcun supporto</InfoMessage></>}
    >
        <Col xs="12">
            <h3>Dati anagrafici</h3>
        </Col>
        <Col xs="12" sm="6">
            <FormGroup>
                <Label>Nome</Label>
                <Input {...inputNome} type="text" />
            </FormGroup>
        </Col>
        <Col xs="12" sm="6">
            <FormGroup>
                <Label>Cognome</Label>
                <Input {...inputCognome} type="text" />
            </FormGroup>
        </Col>
        <Col xs="12" sm="6">
            <FormGroup>
                <Label>Data di nascita</Label>
                <DatePicker className="form-control datepicker_cust" onChange={changeDataNascita} value={cliente.data_nascita ? new Date(cliente.data_nascita) : undefined} />
            </FormGroup>
        </Col>
        <Col xs="12" sm="6">
            <FormGroup>
                <Label>Codice fiscale</Label>
                <Input {...inputCodFiscale} type="text" />
            </FormGroup>
        </Col>
        <Col xs="12">
            <h3>Indirizzo</h3>
        </Col>
        <Col xs="12">
            <FormGroup>
                <Label>Indirizzo</Label>
                <Input {...inputIndirizzo} type="text" />
            </FormGroup>
        </Col>
        <Col xs="6">
            <FormGroup>
                <Label>Città</Label>
                <Input {...inputCitta} type="text" />
            </FormGroup>
        </Col>
        <Col xs="6">
            <FormGroup>
                <Label>CAP</Label>
                <Input {...inputCap} type="text" />
            </FormGroup>
        </Col>
        <Col xs="12">
            <h3>Contatti</h3>
        </Col>
        <Col xs="12">
            <FormGroup>
                <Label>Email</Label>
                <Input {...inputEmail} type="text" />
            </FormGroup>
        </Col>
        <Col xs="6">
            <FormGroup>
                <Label>Telefono Abitazione</Label>
                <Input {...inputTelAbitazione} type="text" />
            </FormGroup>
        </Col>
        <Col xs="6">
            <FormGroup>
                <Label>Telefono Cellulare</Label>
                <Input {...inputTelCellulare} type="text" />
            </FormGroup>
        </Col>
        <Col xs="12">
            <FormGroup>
                <Button disabled={!allInput} onClick={creaCliente}>Crea cliente</Button>
            </FormGroup>
        </Col>
    </Layout>
}