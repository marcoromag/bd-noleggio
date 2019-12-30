import * as React from 'react'
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap'
import BatchAPI, { Batch } from '../api/BatchAPI'
import { DisplayError } from '../components/DisplayError'
import { BatchView } from '../components/BatchView'
import { SelectFornitore } from '../components/SelectFornitore'

export const BatchCarico : React.FC = () => {


    const [error, setError] = React.useState<string>()
    const [fornitore, setFornitore] = React.useState<string>();
    const [lista, setLista] = React.useState<string>();
    const [risultato, setRisultato] = React.useState<Batch>();

    const changeFornitore = React.useCallback( (e: React.ChangeEvent<HTMLInputElement>) => {
        setFornitore(e.target.value);
    },[])

    const changeText = React.useCallback( (e: React.ChangeEvent<HTMLInputElement>) => {
        setLista(e.target.value);
    },[])

    const startBatch = React.useCallback( async () => {
        try {
            setRisultato (await BatchAPI.carico(fornitore!, JSON.parse(lista!)));
        } catch (e) {
            setError(e.message);
        }

    },[fornitore, lista])

    return <Container>
        <Row>
            <Col xs="12"><h1>Batch di carico</h1></Col>
            <Col xs="12"><p>Per iniziare un batch di carico, seleziona il fornitore</p></Col>
            <Col xs="12">
            <DisplayError error={error}/>
            <Form>
                    <FormGroup>
                        <Label>Fornitore</Label>
                        <SelectFornitore onChange={changeFornitore} onLoadError={setError}/>
                    </FormGroup>
                    <FormGroup>
                        <Label>Lista dei video da caricare</Label>
                        <Input type="textarea" onChange={changeText}/>
                    </FormGroup>
                    <FormGroup>
                        <Button disabled={!fornitore || !lista } onClick={startBatch}>Avvia esecuzione</Button>
                    </FormGroup>

                    
            </Form>
            </Col>
        </Row>
        {risultato && <BatchView batch={risultato}/>}
    </Container>


}