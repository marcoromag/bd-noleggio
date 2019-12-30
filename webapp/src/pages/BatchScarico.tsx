import * as React from 'react'
import { Container, Row, Col, Button, Form, FormGroup, Label } from 'reactstrap'
import BatchAPI, { Batch } from '../api/BatchAPI'
import { DisplayError } from '../components/DisplayError'
import { BatchView } from '../components/BatchView'
import { SelectFornitore } from '../components/SelectFornitore'

export const BatchScarico : React.FC = () => {


    const [error, setError] = React.useState<string>()
    const [fornitore, setFornitore] = React.useState<string>();
    const [risultato, setRisultato] = React.useState<Batch>();

    const changeFornitore = React.useCallback( (e: React.ChangeEvent<HTMLInputElement>) => {
        setFornitore(e.target.value);
    },[])

    const startBatch = React.useCallback( async () => {
        try {
            setRisultato (await BatchAPI.scarico(fornitore!));
        } catch (e) {
            setError(e.message);
        }

    },[fornitore])

    return <Container>
        <Row>
            <Col xs="12"><h1>Batch di scarico</h1></Col>
            <Col xs="12"><p>Per iniziare un batch di scarico, seleziona il fornitore</p></Col>
            <Col xs="12">
            <DisplayError error={error}/>
            <Form>
                    <FormGroup>
                        <Label for="password">Fornitore</Label>
                        <SelectFornitore onChange={changeFornitore} onLoadError={setError}/>
                    </FormGroup>
                    <FormGroup>
                        <Button disabled={!fornitore} onClick={startBatch}>Avvia esecuzione</Button>
                    </FormGroup>
                    
            </Form>
            </Col>
        </Row>
        {risultato && <BatchView batch={risultato}/>}
    </Container>


}