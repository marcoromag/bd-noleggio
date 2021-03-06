import apifetch from "./api-fetch";

export interface Video {
    id: string,
    genere: string,
    tipo: string,
    titolo: string,
    regista: string,
    casa_produttrice: string,
    data_disponibilita?: string
    quantita_disponibile: number
}

export interface Supporto {
    id: string
}

export interface SupportoCarico {
    video: string,
    seriale: string,
    costo_supporto: number
}

const ricercaPerTitolo = async (titolo: string, disponibile: boolean = true) => {
    const d = disponibile ? 'DISPONIBILE' : 'NON-DISPONIBILE';
    const response = await apifetch(`/catalogo/ricerca?titolo=${titolo}&tipo=${d}`)
    return response.json() as Promise<Video[]>
}

const ricercaPerGenere = async (genere: string, pagina: number, size: number, disponibile: boolean = true) => {
    const d = disponibile ? 'DISPONIBILE' : 'NON-DISPONIBILE';
    const response = await apifetch(`/catalogo/ricerca?genere=${genere}&pagina=${pagina}&size=${size}&tipo=${d}`)
    return response.json() as Promise<Video[]>
}

const listaSupporti = async (video: string) =>  {
    const response = await apifetch(`/video/${video}/supporti`, {
        method:'GET',
    })
    return response.json() as Promise<Supporto[]>
}

export default {
    ricercaPerTitolo,
    ricercaPerGenere,
    listaSupporti
}


