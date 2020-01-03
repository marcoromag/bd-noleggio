import * as React from 'react'
import { Col, FormGroup, Input, Label, Button, Table, Row, Card, CardHeader, FormText, CardBody} from 'reactstrap';
import ClienteAPI, { Cliente } from '../api/ClienteAPI';


export const SelezionaCliente : React.FC<{onSelect: (cliente: Cliente) => void}> = ({onSelect}) => {

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
                <FormGroup>
                    <Label>Cognome</Label>
                    <Input type="text" onChange={changeNome}/>
                </FormGroup>
            </Col>
            <Col xs="12" sm="4">
                <FormGroup>
                    <Label>Nome</Label>
                    <Input type="text" onChange={changeCognome}/>
                </FormGroup>
            </Col>
            <Col xs="12" sm="auto" className="d-flex align-items-end">
                <FormGroup>
                    <Button disabled={!query.nome && !query.cognome } onClick={ricerca}>Cerca</Button>
                </FormGroup>
            </Col>
        </Row>
    </Col>
    {listaClienti && 
    <Col xs="12">
        {listaClienti.map( c => <Card>
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
                    <Col xs="12" sm="12">
                        <FormGroup>
                            <FormText>Indirizzo</FormText>
                            <Label>{c.indirizzo}</Label>
                        </FormGroup>
                    </Col>
                    <Col xs="6" sm="6">
                        <FormGroup>
                            <FormText>Città</FormText>
                            <Label>{c.citta}</Label>
                        </FormGroup>
                    </Col>
                    <Col xs="6" sm="6">
                        <FormGroup>
                            <FormText>Cap</FormText>
                            <Label>{c.cap}</Label>
                        </FormGroup>
                    </Col>
                    <Col xs="6" sm="6">
                        <FormGroup>
                            <FormText>Telefono abitazione</FormText>
                            <Label>{c.telefono_abitazione}</Label>
                        </FormGroup>
                    </Col>
                    <Col xs="6" sm="6">
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