import apifetch from "./api-fetch"

export interface StatPerDipendente {
    punto_vendita: number,
    matricola: string,
    nome: string,
    cognome: string,
    totale_incasso: number,
    num_noleggi: number

}

const perDipendente = async (data: Date) => {
    const response = await apifetch(`/statistiche/${data.toISOString().slice(0, 10)}/impiegati`, {
        method:'GET'
    })
    return response.json() as Promise<StatPerDipendente>     
} 

export default {
    perDipendente
}