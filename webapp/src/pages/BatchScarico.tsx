import * as React from 'react'
import { Col, Button, FormGroup, Label } from 'reactstrap'
import BatchAPI from '../api/BatchAPI'
import { SelectFornitore } from '../components/SelectFornitore'
import DatePicker from 'react-date-picker'
import { InfoMessage } from '../components/Info'
import { Layout } from '../components/Layout'
import { useHistory } from 'react-router'

export const BatchScarico : React.FC = () => {
    const [error, setError] = React.useState<string>()
    const [fornitore, setFornitore] = React.useState<string>();
    const [giorno, setGiorno] = React.useState<Date>()
    const push = useHistory().push

    const changeGiorno = React.useCallback( (d: Date | Date[]) => {
        if (Array.isArray(d)) return;
        setGiorno(d);
    },[])
    const changeFornitore = React.useCallback( (e: React.ChangeEvent<HTMLInputElement>) => {
        setFornitore(e.target.value);
    },[])

    const startBatch = React.useCallback( async () => {
        try {
            const batch = await BatchAPI.scarico(fornitore!, giorno);
            push(`/batch/${batch.batch_id}`);
        } catch (e) {
            setError(e.message);
        }

    },[fornitore, giorno])

    return <Layout titolo="Batch di scarico" errore={error}
    headline="Esegue lo scarico dei supporti scaduti dopo 90gg dalla data di carico. Un titolo in noleggio non sarà scaricato."
    >       
        <Col xs="12" md="6">
            <FormGroup>
                <Label for="password">Fornitore</Label>
                <SelectFornitore onChange={changeFornitore} onLoadError={setError}/>
            </FormGroup>
        </Col>
        <Col xs="12" md="6">
            <FormGroup>
                <Label>Data di esecuzione</Label>
                <DatePicker className="form-control datepicker_cust" onChange={changeGiorno} value={giorno}/>
                <InfoMessage>Imposta la data di esecuzione se vuoi eseguire un batch in un'altra data rispetto alla data corrente. Questa funzione è solo a scopo di testing!</InfoMessage>
            </FormGroup>
        </Col>
        <Col xs="12">
            <FormGroup>
                <Button disabled={!fornitore} onClick={startBatch}>Avvia esecuzione</Button>
            </FormGroup>
        </Col>
    </Layout>


}