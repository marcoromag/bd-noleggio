import * as React from 'react'
import VideoAPI, { Video } from '../api/VideoAPI';
import { Row, Col, FormGroup, Label, Input, Button, FormText, Card, CardBody, CardHeader } from 'reactstrap';
import { DisplayError } from '../components/DisplayError';

export const VideoView : React.FC<{video: Video, onSelect? : (video: Video) => void}> = ({video, onSelect}) => {
    const onClick = React.useCallback( () => {
        onSelect && onSelect(video);
    }, [video, onSelect])

    return <Card className="mb-4">
        <CardHeader>
            <h5>{video.titolo}</h5>
            {onSelect && <Button className="ml-auto" onClick={onClick}>Seleziona</Button>}
        </CardHeader>
        <CardBody>
        <Row>
        <Col xs="12" sm="4">
            <FormText>Id</FormText>
            <p>{video.id}</p>
        </Col>
        <Col xs="12" sm="4">
            <FormText>Genere</FormText>
            <p>{video.genere}</p>
        </Col>
        <Col xs="12" sm="4">
            <FormText>Regista</FormText>
            <p>{video.regista}</p>
        </Col>
        <Col xs="12" sm="4">
            <FormText>Casa produttrice</FormText>
            <p>{video.casa_produttrice}</p>
        </Col>
        <Col xs="12" sm="4">
            <FormText>Quantità disponibile</FormText>
            <p>{video.quantita_disponibile}</p>
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