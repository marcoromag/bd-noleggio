import * as React from 'react'
import { Col, FormGroup, Input, Label, Button, Table, Row} from 'reactstrap';
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