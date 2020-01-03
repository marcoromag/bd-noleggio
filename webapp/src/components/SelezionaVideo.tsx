import * as React from 'react'
import VideoAPI, { Video } from '../api/VideoAPI';
import { Row, Col, FormGroup, Label, Input, Button, FormText, Card, CardBody, CardHeader, Alert } from 'reactstrap';
import { DisplayError } from './DisplayError';
import { SelectGenere } from './SelectGenere';

export const VideoView : React.FC<{video: Video, onSelect? : (video: Video) => void}> = ({video, onSelect}) => {
    const onClick = React.useCallback( () => {
        onSelect && onSelect(video);
    }, [video, onSelect])

    return <Card className="mb-4">
        <CardHeader>
            <Row>
                <Col xs>
                    <h5>{video.titolo}</h5>
                    <h6>Quantità disponibile: <strong>{video.quantita_disponibile}</strong></h6>
                </Col>
                <Col xs="auto">
                    {onSelect && <Button className="ml-auto" onClick={onClick}>Seleziona</Button>}
                </Col>
            </Row>
        </CardHeader>
        <CardBody>
        <Row>
        <Col xs="12" sm="3">
            <FormText>Id</FormText>
            <p>{video.id}</p>
        </Col>
        <Col xs="12" sm="3">
            <FormText>Genere</FormText>
            <p>{video.genere}</p>
        </Col>
        <Col xs="12" sm="3">
            <FormText>Regista</FormText>
            <p>{video.regista}</p>
        </Col>
        <Col xs="12" sm="3">
            <FormText>Casa produttrice</FormText>
            <p>{video.casa_produttrice}</p>
        </Col>

        </Row>
        </CardBody>
    </Card>
}


export const SelezionaVideoPerTitolo : React.FC<{onSelect? : (video: Video) => void}> = ({onSelect}) => {
    const [error, setError] = React.useState<string>()
    const [titolo, setTitolo] = React.useState<string>()
    const [risultato, setRisultato] = React.useState<Video[]>();

    const changeTitolo = React.useCallback( (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitolo(e.target.value);
    },[])

    const search = React.useCallback( async () => {
        try {
            setRisultato (await VideoAPI.ricercaPerTitolo(titolo!));
        } catch (e) {
            setError(e.message);
        }
    },[titolo])

    return <>
        <Col xs="12">
            <DisplayError error={error}/>
            <Row>
                <Col xs="12" sm>
                    <FormGroup>
                        <Label>Titolo</Label>
                        <Input type="text" onChange={changeTitolo}/>
                    </FormGroup>
                </Col>
                <Col xs="12" sm="auto" className="d-flex align-items-end">
                    <FormGroup>
                        <Button disabled={!titolo} onClick={search}>Cerca</Button>
                    </FormGroup>
                </Col>
            </Row>
        </Col>
        <Col xs="12">
            {risultato && risultato.map (v => <VideoView key={v.id} video={v} onSelect={onSelect}/>)}
        </Col>
    </>
        
} 

export const SelezionaVideoPerGenere : React.FC<{psize: number, onSelect? : (video: Video) => void}> = ({onSelect, psize}) => {
    const [error, setError] = React.useState<string>()
    const [genere, setGenere] = React.useState<string>()
    const [pagina, setPagina] = React.useState<number>(0)
    const [risultato, setRisultato] = React.useState<Video[]>();

    const changeGenere = React.useCallback( (e: React.ChangeEvent<HTMLInputElement>) => {
        setGenere(e.target.value);
        setPagina(0);
    },[])

    const search = React.useEffect( () => {
        genere && VideoAPI.ricercaPerGenere(genere!,pagina,psize)
            .then (setRisultato)
            .catch (e => setError(e.message))
    },[genere, psize, pagina])

    const decrementaPagina = React.useCallback ( () => {
        setPagina(pagina-1);
    },[pagina,search])

    const incrementaPagina = React.useCallback ( () => {
        setPagina(pagina+1);
    },[pagina,search])


    

    return <>
        <Col xs="12">
            <DisplayError error={error}/>
            <Row>
                <Col xs="12" sm>
                    <FormGroup>
                        <Label>Genere</Label>
                        <SelectGenere value={genere} onChange={changeGenere}/>
                    </FormGroup>
                </Col>
            </Row>
        </Col>
        {risultato && (pagina > 0 || risultato.length === psize) &&
            <Col xs="12">
                <Alert>I risultati sono paginati, ogni pagina contiene {psize} elementi. Stai vedendo la pagina {pagina}</Alert>
            </Col>
        }
        <Col xs="12">
            {risultato && risultato.map (v => <VideoView key={v.id} video={v} onSelect={onSelect}/>)}
        </Col>
        {risultato && <>
            <Col xs="auto" className="mr-auto">
                <Button disabled={pagina === 0} onClick={decrementaPagina}>&lt; Pagina precedente</Button>
            </Col>
            <Col xs="auto">Pagina {pagina}</Col>
            <Col xs="auto" className="ml-auto">
                <Button disabled={risultato.length !== psize} onClick={incrementaPagina}>Pagina successiva &gt;</Button>
            </Col>
        </>}
    </>
}