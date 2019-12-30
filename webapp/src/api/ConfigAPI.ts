import apifetch from "./api-fetch"

export interface Fornitore {
    id: string,
    nome: string
}

export interface TermineNoleggio {
    giorni: number,
    importo_iniziale: number,
    importo_gg_successivi: number
}

export interface Genere {
    id: string,
    nome: string
}

const listaFornitori = async () => {
    const response = await apifetch('/fornitori', {
        method:'GET'
    })
    return response.json() as Promise<Fornitore[]>
}

const listaTermini = async () => {
    const response = await apifetch('/termini_noleggio', {
        method:'GET'
    })
    return response.json() as Promise<TermineNoleggio[]>
}

const listaGeneri = async () => {
    const response = await apifetch('/generi', {
        method:'GET'
    })
    return response.json() as Promise<Genere[]>
}

export default {
    listaFornitori,
    listaTermini,
    listaGeneri
}