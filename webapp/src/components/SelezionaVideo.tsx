import * as React from 'react'
import VideoAPI, { Video } from '../api/VideoAPI';
import { Row, Col, FormGroup, Label, Input, Button, FormText, Card, CardBody, CardHeader, Alert } from 'reactstrap';
import { DisplayError } from './DisplayError';
import { SelectGenere } from './SelectGenere';
import styles from './SelezionaVideo.module.scss'
import { InfoMessage } from './Info';

export const VideoView : React.FC<{video: Video, onSelect? : (video: Video) => void}> = ({video, onSelect}) => {
    const onClick = React.useCallback( () => {
        onSelect && onSelect(video);
    }, [video, onSelect])
    
    const bordo = video.tipo === 'DISPONIBILE' ? 
        (video.quantita_disponibile ? styles.disponibile : styles.nondisponibile)
    :  styles.prenotabile

    return <Card className="mb-4">
        <CardHeader className={bordo}>
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


export const SelezionaVideoPerTitolo : React.FC<{onSelect? : (video: Video) => void, conDisponibilita?: 'DISPONIBILE' | 'NON-DISPONIBILE'}> = ({onSelect,conDisponibilita}) => {
    const [error, setError] = React.useState<string>()
    const [titolo, setTitolo] = React.useState<string>()
    const [risultato, setRisultato] = React.useState<Video[]>();
    const [disponibilita, setDisponibilita] = React.useState('DISPONIBILE');

    const changeTitolo = React.useCallback( (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitolo(e.target.value);
    },[])

    const changeDisponibilita = React.useCallback( (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisponibilita(e.target.value);
    },[])

    const search = React.useCallback( async () => {
        const d = (conDisponibilita || disponibilita) === 'DISPONIBILE';
        try {
            setRisultato (await VideoAPI.ricercaPerTitolo(titolo!, d));
        } catch (e) {
            setError(e.message);
        }
    },[titolo,disponibilita, conDisponibilita])

    return <>
        <Col xs="12">
            <DisplayError error={error}/>
            <Row className="align-items-end mb-4">

                <Col xs>
                    <Label>Titolo</Label>
                    <Input type="text" onChange={changeTitolo}/>
                </Col>
                {!conDisponibilita && <Col xs="auto">
                    <Label>Genere</Label>
                    <Input type="select" onChange={changeDisponibilita}>
                        <option value="DISPONIBILE">Disponibile</option>
                        <option value="NON-DISPONIBILE">Prenotabile</option>
                    </Input>
                </Col>}
                <Col xs="auto">
                    <Button disabled={!titolo} onClick={search}>Cerca</Button>
                </Col>
                {!titolo && <Col xs="12">
                    <InfoMessage>Inserire una parola del nome del titolo. La parola deve essere completa.</InfoMessage>
                </Col>}
            </Row>
    
        </Col>
        <Col xs="12">
            {risultato && risultato.length === 0 && <Alert color="info">Nessun titolo trovato</Alert>}
            {risultato && risultato.map (v => <VideoView key={v.id} video={v} onSelect={onSelect}/>)}
        </Col>
    </>   
} 

export const SelezionaVideoPerGenere : React.FC<{psize: number, onSelect? : (video: Video) => void, conDisponibilita?: 'DISPONIBILE' | 'NON-DISPONIBILE'}> = ({onSelect, psize, conDisponibilita}) => {
    const [error, setError] = React.useState<string>()
    const [genere, setGenere] = React.useState<string>()
    const [pagina, setPagina] = React.useState<number>(0)
    const [risultato, setRisultato] = React.useState<Video[]>();
    const [disponibilita, setDisponibilita] = React.useState('DISPONIBILE');

    const changeGenere = React.useCallback( (e: React.ChangeEvent<HTMLInputElement>) => {
        setGenere(e.target.value);
        setPagina(0);
    },[])

    const changeDisponibilita = React.useCallback( (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisponibilita(e.target.value);
    },[])

    React.useEffect( () => {
        const d = (conDisponibilita || disponibilita) === 'DISPONIBILE';
        genere && VideoAPI.ricercaPerGenere(genere,pagina,psize,d)
            .then (setRisultato)
            .catch (e => setError(e.message))
    },[genere, psize, pagina,conDisponibilita, disponibilita])

    const decrementaPagina = React.useCallback ( () => {
        setPagina(pagina-1);
    },[pagina])

    const incrementaPagina = React.useCallback ( () => {
        setPagina(pagina+1);
    },[pagina])


    

    return <>
        <Col xs="12">
            <DisplayError error={error}/>
            <Row className="align-items-end mb-4">
                <Col xs="12" sm>
                    <Label>Genere</Label>
                    <SelectGenere value={genere} onChange={changeGenere}/>
                </Col>
                {!conDisponibilita && <Col xs="auto">
                    <Label>Disponibilità</Label>
                    <Input type="select" onChange={changeDisponibilita}>
                        <option value="DISPONIBILE">Disponibile</option>
                        <option value="NON-DISPONIBILE">Prenotabile</option>
                    </Input>
                </Col>}
                {!genere && <Col xs="12">
                    <InfoMessage>Selezionare un genere. La ricerca verrà avviata automaticamente</InfoMessage>
                </Col>}
            </Row>
        </Col>
        {risultato && risultato.length === 0 && 
        <Col xs="12">
            <Alert color="info">Nessun titolo trovato</Alert>
        </Col>
        }
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