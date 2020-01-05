import apifetch from "./api-fetch";
import { isodate } from "./utils";

export interface Supporto {
    id: string,
    seriale: string,
    video: string,
    fornitore: string,
    punto_vendita: string,
    data_carico: string,
    data_scarico: string | null
    stato_fisico: string
}
export interface Batch {
    batch_id: string,
    tipo: 'CARICO' | 'SCARICO',
    esito: string,
    errore?: string,
    punto_vendita: number,
    impiegato: string,
    data: string,
    supporti: Supporto[]
}

export interface SupportoCarico {
    video: string,
    seriale: string,
    costo_supporto: number
}

const esito = async (batch_id: string) => {
    const response = await apifetch(`/batch/${batch_id}`)
    return response.json() as Promise<Batch>
}

const lista = async () => {
    const response = await apifetch(`/batch`)
    return response.json() as Promise<Batch[]>
}

const scarico = async (fornitore: string, data?: Date) => {
    const response = await apifetch('/batch/scarico', {
        method:'POST',
        body:JSON.stringify({fornitore, data: (data ? isodate(data) : undefined)})
    })
    return response.json() as Promise<Batch>
}

const carico = async (fornitore: string, lista: SupportoCarico[], data?: Date) => {
    const response = await apifetch('/batch/carico', {
        method:'POST',
        body:JSON.stringify({
            fornitore,
            lista,
            data: (data ? isodate(data) : undefined)
        })
    })
    return response.json() as Promise<Batch>
}

export default {
    scarico,
    carico,
    esito,
    lista
}


