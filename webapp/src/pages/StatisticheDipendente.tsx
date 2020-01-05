import * as React from 'react'
import DatePicker from 'react-date-picker'
import { Container, Col, Row, FormGroup, Label, Button, Table, Input } from 'reactstrap'
import { DisplayError } from '../components/DisplayError'
import './StatisticheDipendente.css'
import StatisticheAPI, { StatPerDipendente } from '../api/StatisticheAPI'
import { Loading } from '../components/Loading'
import { Layout } from '../components/Layout'

interface CampiDisponibili {
    punto_vendita: boolean,
    matricola: boolean,
    nome: boolean,
    cognome: boolean,
    totale_incasso: boolean
}

export const StatisticaPerDipendenteView : React.FC<{stats: StatPerDipendente[], campi: CampiDisponibili}> = ({stats, campi}) => {
    return  <Table>
        <thead>
            <tr>
                {campi.punto_vendita && <th>Punto vendita</th>}
                {campi.matricola && <th>Matricola</th>}
                {campi.nome && <th>Nome</th>}
                {campi.cognome && <th>Cognome</th>}
                {campi.totale_incasso && <th>Totale incasso</th>}
            </tr>
        </thead>
        <tbody>
            {stats.map( s => 
                <tr key={s.punto_vendita}>
                    {campi.punto_vendita && <td>{s.punto_vendita_nome}</td>}
                    {campi.matricola && <td>{s.matricola}</td>}
                    {campi.nome && <td>{s.nome}</td>}
                    {campi.cognome && <td>{s.cognome}</td>}
                    {campi.totale_incasso && <td className={s.totale_incasso > 0 ? 'text-success' : 'text-secondary'}>{s.totale_incasso}</td>}
                </tr>
            )}
        </tbody>
    </Table>
}

const useToggle = (field: keyof CampiDisponibili, campi: CampiDisponibili, setCampi: (c:CampiDisponibili)=>void) => {
    return React.useCallback( (event: React.ChangeEvent<HTMLInputElement>) => {
        setCampi({...campi, [field]: !campi[field]})
    },[campi])
}
const SelezionaCampi: React.FC<{campi: CampiDisponibili, setCampi: (c:CampiDisponibili) => void}> = ({campi, setCampi}) => {
const togglePuntoVendita = useToggle('punto_vendita',campi, setCampi);
const toggleMatricola = useToggle('matricola',campi, setCampi);
const toggleNome = useToggle('nome',campi, setCampi);
const toggleCognome = useToggle('cognome',campi, setCampi);
const toggleTotaleIncasso = useToggle('totale_incasso',campi, setCampi);



return  <FormGroup check inline>
        <Label check className="mr-3">
        <Input type="checkbox" onChange={togglePuntoVendita} checked={campi.punto_vendita}/>Punto vendita
        </Label>
        <Label check className="mr-3">
        <Input type="checkbox" onChange={toggleMatricola} checked={campi.matricola}/>Matricola
        </Label>
        <Label check className="mr-3">
        <Input type="checkbox" onChange={toggleNome} checked={campi.nome}/>Nome
        </Label>
        <Label check className="mr-3">
        <Input type="checkbox" onChange={toggleCognome} checked={campi.cognome}/>Cognome
        </Label>
        <Label check className="mr-3">
        <Input type="checkbox" onChange={toggleTotaleIncasso} checked={campi.totale_incasso}/>Totale incasso
        </Label>
    </FormGroup>
}

export const StatisticheDipendente : React.FC = () => {
    const oggi = React.useMemo( ()=> new Date(), [])
    const [error, setError] = React.useState<string>()
    const [loading, setLoading] = React.useState(false)
    const [giorno, setGiorno] = React.useState<Date>()
    const [stats, setStats] = React.useState<StatPerDipendente[]>()
    const [campi, setCampi] = React.useState<CampiDisponibili>({
        punto_vendita: true, nome: true, cognome: true, matricola: true, totale_incasso: true
    })

    const changeGiorno = React.useCallback( (d: Date | Date[]) => {
        if (Array.isArray(d)) return;
        setGiorno(d);
        setStats(undefined);
    },[])

    React.useEffect ( ()=> {
        if (! giorno) return;
        setLoading(true)
        StatisticheAPI.perDipendente(giorno!)
        .then (setStats)
        .catch (e => setError(e.message))
        .finally( () => {setLoading(false)});
    },[giorno])

    return <Layout titolo="Statistiche per dipendente" errore={error}
    headline="In questa pagina puoi vedere tutte le statistiche dei dipendenti di tutti i punti vendita.">
            <Col xs="auto">
                <Label>Giorno</Label>
                <DatePicker className="form-control datepicker_cust" onChange={changeGiorno} value={giorno} maxDate={oggi}/>
            </Col>
            <Col xs="12" className="mt-4">
                <Label className="d-block">Campi da visualizzare nel report</Label>
                <SelezionaCampi campi={campi} setCampi={setCampi}/>
            </Col>
        <Col cs="12" className="mt-4">
            {loading ? <Loading/> :null}
            {stats && <StatisticaPerDipendenteView campi={campi} stats={stats}/>}
        </Col>
    </Layout>
    
}