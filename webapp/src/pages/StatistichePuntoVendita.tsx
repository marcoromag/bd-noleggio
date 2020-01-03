import * as React from 'react'
import DatePicker from 'react-date-picker'
import { Col, FormGroup, Label,  Table, Input } from 'reactstrap'
import './StatisticheDipendente.css'
import StatisticheAPI, {  StatPerPuntoVendita } from '../api/StatisticheAPI'
import { Loading } from '../components/Loading'
import { Layout } from '../components/Layout'

interface CampiDisponibili {
    nome: boolean,
    citta: boolean,
    indirizzo: boolean,
    cap: boolean,
    totale_incasso: boolean,
    numero_ricevute: boolean
}

const StatisticaPerPuntoVenditaView : React.FC<{stats: StatPerPuntoVendita[], campi: CampiDisponibili}> = ({stats, campi}) => {
    return  <Table>
        <thead>
            <tr>
                {campi.nome && <th>Punto vendita</th>}
                {campi.citta && <th>Città</th>}
                {campi.indirizzo && <th>Indirizzo</th>}
                {campi.cap && <th>CAP</th>}
                {campi.numero_ricevute && <th>Ricevute emesse</th>}
                {campi.totale_incasso && <th>Totale incasso</th>}
            </tr>
        </thead>
        <tbody>
            {stats.map( s => 
                <tr key={s.nome}>
                    {campi.nome && <td>{s.nome}</td>}
                    {campi.indirizzo && <td>{s.indirizzo}</td>}
                    {campi.citta && <td>{s.citta}</td>}
                    {campi.cap && <td>{s.cap}</td>}
                    {campi.numero_ricevute && <td>{s.numero_ricevute}</td>}
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
const togglePuntoVendita = useToggle('nome',campi, setCampi);
const toggleIndirizzo = useToggle('indirizzo',campi, setCampi);
const toggleCitta = useToggle('citta',campi, setCampi);
const toggleCAP = useToggle('cap',campi, setCampi);
const toggleNRic = useToggle('numero_ricevute',campi, setCampi);
const toggleTotaleIncasso = useToggle('totale_incasso',campi, setCampi);



return  <FormGroup check inline>
        <Label check className="mr-3">
        <Input type="checkbox" onChange={togglePuntoVendita} checked={campi.nome}/>Punto vendita
        </Label>
        <Label check className="mr-3">
        <Input type="checkbox" onChange={toggleIndirizzo} checked={campi.indirizzo}/>Indirizzo
        </Label>
        <Label check className="mr-3">
        <Input type="checkbox" onChange={toggleCitta} checked={campi.citta}/>Citta
        </Label>
        <Label check className="mr-3">
        <Input type="checkbox" onChange={toggleCAP} checked={campi.cap}/>CAP
        </Label>
        <Label check className="mr-3">
        <Input type="checkbox" onChange={toggleNRic} checked={campi.numero_ricevute}/>Ricevute emesse
        </Label>
        <Label check className="mr-3">
        <Input type="checkbox" onChange={toggleTotaleIncasso} checked={campi.totale_incasso}/>Totale incasso
        </Label>
    </FormGroup>
}

export const StatistichePuntoVendita : React.FC = () => {
    const oggi = React.useMemo( ()=> new Date(), [])
    const [error, setError] = React.useState<string>()
    const [loading, setLoading] = React.useState(false)
    const [giorno, setGiorno] = React.useState<Date>()
    const [stats, setStats] = React.useState<StatPerPuntoVendita[]>()
    const [campi, setCampi] = React.useState<CampiDisponibili>({
        nome: true, indirizzo: true, citta: true, cap: true, totale_incasso: true, numero_ricevute:true
    })

    const changeGiorno = React.useCallback( (d: Date | Date[]) => {
        if (Array.isArray(d)) return;
        setGiorno(d);
        setStats(undefined);
    },[])

    const leggiStatistica = React.useEffect ( ()=> {
        if (! giorno) return;
        setLoading(true)
        StatisticheAPI.perPuntoVendita(giorno!)
        .then (setStats)
        .catch (e => setError(e.message))
        .finally( () => {setLoading(false)});
    },[giorno])

    return <Layout titolo="Statistiche per punto vendita" errore={error}
    headline="In questa pagina puoi vedere le statistiche di vendita di tutti i punti vendita. Seleziona un giorno.">
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
            {stats && <StatisticaPerPuntoVenditaView campi={campi} stats={stats}/>}
        </Col>
    </Layout>
    
}