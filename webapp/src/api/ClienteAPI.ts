import apifetch from "./api-fetch"
import { isodate } from "./utils"

export interface DocumentoLiberatoria {
    documento_liberatoria: string,
    data_sottoscrizione: string,
    posizione_archivio: string,
}

export interface Cliente {
    cod_fiscale: string,
    data_nascita: string,
    nome: string,
    cognome: string,
    indirizzo: string,
    citta: string,
    cap: string,
    telefono_abitazione: string,
    telefono_cellulare: string,
    email: string,
    documento_liberatoria: string,
    data_sottoscrizione: string,
    posizione_archivio: string,
}


const ricerca = async (nome: string, cognome: string) => {
    const response = await apifetch(`/cliente?nome=${nome}&cognome=${cognome}`)
    return response.json() as Promise<Cliente[]>
}

const cliente = async (cod_fiscale: string) => {
    const response = await apifetch(`/cliente/${cod_fiscale}`)
    return response.json() as Promise<Cliente>

}

const crea = async (cliente: Cliente) => {
    const response = await apifetch(`/cliente`, {
        method:'POST',
        body: JSON.stringify(cliente)
    })
    return response.json() as Promise<Cliente>
}

const creaDocumento = async (cod_fiscale: string, documento_liberatoria: string,data_sottoscrizione: Date,posizione_archivio: string) => {
    const response = await apifetch(`/cliente/${cod_fiscale}/documento`, {
        method:'POST',
        body: JSON.stringify({
            id: documento_liberatoria,
            data_sottoscrizione: isodate(data_sottoscrizione),
            posizione_archivio, 
        })
    })
    return response.json() as Promise<string>
}

export default {
    ricerca,
    crea,
    cliente,
    creaDocumento
}
