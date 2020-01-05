import apifetch from "./api-fetch"
import { Video } from "./VideoAPI"


export interface Noleggio {
    id: string,
    supporto: string,
    cliente: string,
    impiegato: string,
    data_inizio: string,
    data_restituzione?: string,
    termine_noleggio: number,
    video: string,
    titolo: string,
    ricevuta?: string
}

export interface Ricevuta {
    numero_ricevuta: string,
    data: string,
    supporto: string,
    titolo: string,
    cliente: string,
    nome: string,
    cognome: string,
    indirizzo: string,
    citta: string
    cap: string,
    impiegato_nome: string,
    impiegato_cognome: string,
    matricola: string,
    totale: number,
    dettagli: DettagliRicevuta[]
}

export interface DettagliRicevuta {
    descrizione: string,
    costo: number
}
export interface RspTerminaNoleggio {
    id_ricevuta: string
}

export type StatoSupporto= 'BUONO' | 'DANNEGGIATO'

const attiva = async (cod_fiscale: string, termine: number, supporto: string) => {
    const response = await apifetch('/noleggio', {
        method:'POST',
        body:JSON.stringify({
            cod_fiscale,
            termine,
            supporto
        })
    })
    return response.json() as Promise<string>    
}

const termina = async (id_noleggio: string, stato: StatoSupporto) => {
    const response = await apifetch(`/noleggio/${id_noleggio}`, {
        method:'POST',
        body:JSON.stringify({
            stato
        })
    })
    return response.json() as Promise<RspTerminaNoleggio>    
}

const ricevuta = async (id_ricevuta: string) => {
    const response = await apifetch(`/ricevuta/${id_ricevuta}`)
    return response.json() as Promise<Ricevuta>   
}


const noleggiAttiviPerCliente = async (cod_fiscale:string) => {
    const response = await apifetch(`/cliente/${cod_fiscale}/noleggi`, {
        method:'GET'
    })
    return response.json() as Promise<Noleggio[]>    
}

const noleggiTerminatiPerCliente = async (cod_fiscale:string) => {
    const response = await apifetch(`/cliente/${cod_fiscale}/noleggi-terminati`, {
        method:'GET'
    })
    return response.json() as Promise<Noleggio[]>    
}

const prenotazioniPerCliente = async (cod_fiscale:string) => {
    const response = await apifetch(`/cliente/${cod_fiscale}/prenotazione`, {
        method:'GET'
    })
    return response.json() as Promise<Video[]>    
}

const prenotazione = async (cod_fiscale:string, id_video: string) => {
    const response = await apifetch(`/cliente/${cod_fiscale}/prenotazione/${id_video}`, {
        method:'POST',
    })
    return response.json() as Promise<boolean>    
}



export default {
    attiva,
    termina,
    ricevuta,
    noleggiAttiviPerCliente,
    noleggiTerminatiPerCliente,
    prenotazioniPerCliente,
    prenotazione
}