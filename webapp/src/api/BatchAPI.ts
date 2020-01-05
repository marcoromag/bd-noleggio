import apifetch from "./api-fetch";

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

const scarico = async (fornitore: string) => {
    const response = await apifetch('/batch/scarico', {
        method:'POST',
        body:JSON.stringify({fornitore})
    })
    return response.json() as Promise<Batch>
}

const carico = async (fornitore: string, lista: SupportoCarico[]) => {
    const response = await apifetch('/batch/carico', {
        method:'POST',
        body:JSON.stringify({
            fornitore,
            lista
        })
    })
    return response.json() as Promise<Batch>
}

export default {
    scarico,
    carico
}


