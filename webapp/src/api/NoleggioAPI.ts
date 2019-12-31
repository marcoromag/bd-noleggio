import apifetch from "./api-fetch"


export interface NoleggioAttivo {
    id: string,
    supporto: string,
    cliente: string,
    impiegato: string,
    data_inizio: string,
    data_fine: string,
    termine_noleggio: number,
    video: string,
    titolo: string
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
    return response.json() as Promise<number>    
}


const noleggiAttiviPerCliente = async (cod_fiscale:string) => {
    const response = await apifetch(`/cliente/${cod_fiscale}/noleggi`, {
        method:'GET'
    })
    return response.json() as Promise<NoleggioAttivo[]>    
}


export default {
    attiva,
    termina,
    noleggiAttiviPerCliente
}