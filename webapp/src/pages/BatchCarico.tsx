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
            costo_supporto: parseFloat(values[2])
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

    return <Layout titolo="Batch di carico" errore={error}
    headline={<>
    <p>Un carico di magazzino è rappresentato da un un testo CSV, dove ogni riga contiene:</p>
    <span>video_id,seriale_supporto,costo_supporto</span>
    <p>dove:</p>
    <ul>
        <li>video_id è l'id di un video</li>
        <li>seriale_supporto è il codice seriale del supporto, riferito al fornitore. 
        il codice seriale deve essere univoco per fornitore, si può riutilizzare un codice seriale dopo aver scaricato il supporto tramite un batch di scarico</li>
        <li>il costo del supporto rappresenta il costo che verrà fatto pagare al cliente se il supporto è danneggiato</li>
    </ul>    
    </>}
    
    >
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
            {!risultato && <Col>
                <p>Esempio:</p>
                <p>
                    <span className="code">
                        tt0133093,S00001,10<br/>
                        tt0133093,S00002,10<br/>
                        tt0133093,S00003,10<br/>
                        tt0133093,S00004,10<br/>
                        tt0133093,S00005,10<br/>
                        tt0133093,S00006,10<br/>
                        tt0133093,S00007,10<br/>
                        tt0133093,S00008,10<br/>
                        tt0133093,S00009,10<br/>
                        tt0133093,S00010,10<br/>
                        tt0133093,S00011,10<br/>
                        tt0234215,R0001,8<br/>
                        tt0234215,R0002,8<br/>
                        tt0234215,R0003,8<br/>
                        tt0234215,R0004,8<br/>
                        tt0234215,R0005,8<br/>
                        tt0056016,G1,8<br/>
                        tt0056016,G2,8<br/>
                        tt0056016,G3,8<br/>
                    </span>
                </p>
            </Col>}
    </Layout>


}