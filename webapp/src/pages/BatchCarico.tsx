import * as React from 'react'
import { Col, Button, Form, FormGroup, Label, Input } from 'reactstrap'
import BatchAPI, { Batch, SupportoCarico } from '../api/BatchAPI'
import { BatchView } from '../components/BatchView'
import { SelectFornitore } from '../components/SelectFornitore'
import { Layout } from '../components/Layout'

const creaListaBatch = (lista: string) => {
    const entries = lista.split('\n');
    return entries.map(e =>{
        const values = e.split(',');
        return {
            video: values[0],
            seriale: values[1],
            costo_supporto: parseFloat(values[3])
        } as SupportoCarico
    })
}

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
            const data = creaListaBatch(lista!);
            setRisultato (await BatchAPI.carico(fornitore!, data));
        } catch (e) {
            setError(e.message);
        }

    },[fornitore, lista])

    return <Layout titolo="Batch di carico" errore={error}>
            <Col xs="12">
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
            {risultato && <BatchView batch={risultato}/>}
    </Layout>


}