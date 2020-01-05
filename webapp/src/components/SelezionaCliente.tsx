import * as React from 'react'
import { Col, FormGroup, Input, Label, Button, Row, Card, CardHeader, FormText, CardBody} from 'reactstrap';
import ClienteAPI, { Cliente } from '../api/ClienteAPI';
import { InfoMessage } from './Info';


export const SelezionaCliente : React.FC<{onSelect: (cliente: Cliente) => void, info?:string}> = ({onSelect, info}) => {

    const [query, setQuery] = React.useState({nome:'', cognome:''});
    const [listaClienti, setListaClienti] = React.useState<Cliente[]>()
    const changeNome = React.useCallback( (e : React.ChangeEvent<HTMLInputElement>) => setQuery({...query, nome: e.target.value}), [query])
    const changeCognome = React.useCallback( (e : React.ChangeEvent<HTMLInputElement>) => setQuery({...query, cognome: e.target.value}), [query])
    const ricerca = React.useCallback( async ()=>{
        const lista = await ClienteAPI.ricerca(query.cognome, query.nome);
        setListaClienti(lista);
    },[query])

    return <>
    <Col xs="12">
        <Row>
            <Col xs="12" sm="">
                    <Label>Cognome</Label>
                    <Input type="text" onChange={changeNome}/>
            </Col>
            <Col xs="12" sm="4">
                    <Label>Nome</Label>
                    <Input type="text" onChange={changeCognome}/>
            </Col>
            <Col xs="12" sm="auto" className="d-flex align-items-end">
                 <Button disabled={!query.nome && !query.cognome } onClick={ricerca}>Cerca</Button>
            </Col>
            <Col xs="12" className="mb-2">
                <InfoMessage>{info || 'Per selezionare il cliente, inserisci le iniziali del cognome o del nome, poi premi il tasto Cerca'}</InfoMessage>
            </Col>
        </Row>
    </Col>
    {listaClienti && 
    <Col xs="12">
        {listaClienti.map( c => <Card className="mt-4">
            <CardHeader>
                <Row>
                    <Col xs>
                        <h5>{c.nome} {c.cognome}</h5>
                        <h6>{c.cod_fiscale}</h6>
                    </Col>
                    <Col xs="auto"><Button onClick={() => onSelect(c)}>Seleziona</Button></Col>
                </Row>
                
            </CardHeader>
            <CardBody>
                <Row>
                    <Col xs="12" sm="6">
                        <FormGroup>
                            <FormText>Indirizzo</FormText>
                            <span className="d-block">{c.indirizzo}</span>
                            <span className="d-block">{c.cap} {c.citta}</span>
                        </FormGroup>
                    </Col>
                    <Col xs="12" sm="6">
                        <FormGroup>
                            <FormText>Telefono abitazione</FormText>
                            <Label>{c.telefono_abitazione}</Label>
                        </FormGroup>
                        <FormGroup>
                            <FormText>Telefono cellulare</FormText>
                            <Label>{c.telefono_cellulare}</Label>
                        </FormGroup>
                    </Col>
                </Row>
            </CardBody>
        </Card>
        )}
    </Col>
    }
    </>
}