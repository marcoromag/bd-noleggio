import * as React from 'react'
import DatePicker from 'react-date-picker'
import { Container, Col, Row, FormGroup, Label, Button, Table } from 'reactstrap'
import { DisplayError } from '../components/DisplayError'
import './StatisticheDipendente.css'
import StatisticheAPI, { StatPerDipendente } from '../api/StatisticheAPI'
import { Loading } from '../components/Loading'

export const StatisticaPerDipendenteView : React.FC<{stats: StatPerDipendente[]}> = ({stats}) => {
    return <Col xs="12">
        <Table>
            <thead>
                <tr>
                    <th>Punto vendita</th>
                    <th>Matricola</th>
                    <th>Nome</th>
                    <th>Numero noleggi</th>
                    <th>Totale incasso</th>
                </tr>
            </thead>
            <tbody>
                {stats.map( s => 
                    <tr key={s.punto_vendita}>
                        <td>{s.matricola}</td>
                        <td>{s.cognome} {s.nome}</td>
                        <td>{s.num_noleggi}</td>
                        <td>{s.totale_incasso}</td>
                    </tr>
                )}
            </tbody>
        </Table>
    </Col>
}

export const StatisticheDipendente : React.FC = () => {
    const oggi = React.useMemo( ()=> new Date(), [])
    const [error, setError] = React.useState<string>()
    const [loading, setLoading] = React.useState(false)
    const [giorno, setGiorno] = React.useState<Date>()
    const [stats, setStats] = React.useState<StatPerDipendente[]>()

    const changeGiorno = React.useCallback( (d: Date | Date[]) => {
        if (Array.isArray(d)) return;
        setGiorno(d);
        setStats(undefined);
    },[])


    const leggiStatistica = React.useCallback ( async ()=> {
        try {
            setLoading(true)
            const s = await StatisticheAPI.perDipendente(giorno!);
            setStats(s);
            setLoading(false)
        } catch (e) {
            setError(e);
            setLoading(false);
        }

    },[giorno])

    return <Container>
        <Row>
            <Col xs="12"><h1>Statistiche per dipendente</h1></Col>
            <Col xs="12">
                <DisplayError error={error}/>
            </Col>
            <Col xs="12" sm>
                <FormGroup>
                    <Label>Giorno</Label>
                    <DatePicker className="form-control datepicker_cust" onChange={changeGiorno} value={giorno} maxDate={oggi}/>
                </FormGroup>
            </Col>
            <Col xs="12" sm="auto" className="d-flex align-items-end">
                <FormGroup>
                    <Button disabled={!giorno} onClick={leggiStatistica}>Cerca</Button>
                </FormGroup>
            </Col>
        </Row>
        <Row>
            {loading ? <Loading/> :null}
            {stats && <StatisticaPerDipendenteView stats={stats}/>}
        </Row>
    </Container>
    
}