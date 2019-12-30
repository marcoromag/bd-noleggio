import apifetch from "./api-fetch"

export interface User {
    matricola: string,
    nome: string,
    cognome: string,
    tipo: 'DIRIGENTE' | 'IMPIEGATO',
    punto_vendita: number
}

const login = async (utente: string, password: string) => {
    const response = await apifetch('/utente/login', {
        method:'POST',
        body:JSON.stringify({utente,password})
    })

    return response.json() as Promise<User>;
}
const logout = async () => {
    await apifetch('/utente/logout', {
        method:'POST'
    });
}

const user = async () => {
    const response = await apifetch('/utente', {
        method:'GET'
    })
    return response.json() as Promise<User>;
}


export default {
    login,
    logout,
    user
}