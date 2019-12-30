import apifetch from "./api-fetch"

export interface Cliente {
    cod_fiscale: string,
    nome: string,
    cognome: string,
    telefono_abitazione: string,
    telefono_cellulare: string,
    email: string,
    data_sottoscrizione: string,
    posizione_archivio: string,
}


const ricerca = async (nome: string, cognome: string) => {
    const response = await apifetch(`/cliente?nome=${nome}&cognome=${cognome}`, {
        method:'GET'
    })
    return response.json() as Promise<Cliente[]>
}

export default {
    ricerca
}
