import * as React from 'react'
import VideoAPI, { Video } from '../api/VideoAPI';
import { Container, Row, Col, FormGroup, Label, Input, Button, FormText } from 'reactstrap';
import { DisplayError } from '../components/DisplayError';

export const VideoView : React.FC<{video: Video}> = ({video}) => {
    return <Row>
        <Col xs="12" sm="4">
            <FormText>Id</FormText>
            <p>{video.id}</p>
        </Col>
        <Col xs="12" sm="4">
            <FormText>Titolo</FormText>
            <p>{video.titolo}</p>
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
}

export const RicercaPerTitolo : React.FC = () => {
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

    return <Container>
        <Row>
            <Col xs="12"><h1>Ricerca per titolo</h1></Col>
            <Col xs="12" sm="8">
            <DisplayError error={error}/>
                <FormGroup>
                    <Label>Titolo</Label>
                    <Input type="text" onChange={changeTitolo}/>
                </FormGroup>
            </Col>
            <Col xs="12" sm="4">
                <FormGroup>
                    <Button disabled={!titolo} onClick={search}>Cerca</Button>
                </FormGroup>
            </Col>
        </Row>
        {risultato && risultato.map (v => <VideoView key={v.id} video={v}/>)}
    </Container>

}