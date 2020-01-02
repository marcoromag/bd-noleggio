import apifetch from "./api-fetch"

export interface StatPerDipendente {
    punto_vendita: number,
    matricola: string,
    nome: string,
    cognome: string,
    totale_incasso: number,
    num_noleggi: number

}

const isodate = (date: Date) => {
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    const msLocal =  date.getTime() - offsetMs;
    const dateLocal = new Date(msLocal);
    return dateLocal.toISOString().slice(0, 10);
}
const perDipendente = async (data: Date) => {
    const response = await apifetch(`/statistiche/${isodate(data)}/impiegati`, {
        method:'GET'
    })
    return response.json() as Promise<StatPerDipendente[]>     
} 

export default {
    perDipendente
}