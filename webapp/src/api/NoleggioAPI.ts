import apifetch from "./api-fetch"


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

export default {
    attiva
}