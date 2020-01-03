import apifetch from "./api-fetch"
import { isodate } from "./utils"

export interface StatPerDipendente {
    punto_vendita: number,
    punto_vendita_nome: string,
    matricola: string,
    nome: string,
    cognome: string,
    totale_incasso: number,
    num_noleggi: number

}

export interface StatPerPuntoVendita {
    id: number,
    nome: string,
    citta: string,
    indirizzo: string,
    cap: string,
    totale_incasso: number,
    numero_ricevute: number
}


const perDipendente = async (data: Date) => {
    const response = await apifetch(`/statistiche/${isodate(data)}/impiegati`, {
        method:'GET'
    })
    return response.json() as Promise<StatPerDipendente[]>     
} 
const perPuntoVendita = async (data: Date) => {
    const response = await apifetch(`/statistiche/${isodate(data)}`, {
        method:'GET'
    })
    return response.json() as Promise<StatPerPuntoVendita[]>   
}

export default {
    perDipendente,
    perPuntoVendita
}