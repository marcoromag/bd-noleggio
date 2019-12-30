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

export interface SupportoCarico {
    video: string,
    seriale: string,
    costo_supporto: number
}

const ricercaPerTitolo = async (titolo: string) => {
    const response = await apifetch(`/catalogo/ricerca/titolo?titolo=${titolo}`, {
        method:'GET',
    })
    return response.json() as Promise<Video[]>
}

const ricercaPerGenere = async (genere: string) => {
    const response = await apifetch(`/catalogo/ricerca/genere?genere=${genere}`, {
        method:'GET',
    })
    return response.json() as Promise<Video[]>
}

export default {
    ricercaPerTitolo,
    ricercaPerGenere
}


