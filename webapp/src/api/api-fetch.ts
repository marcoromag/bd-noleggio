import config from "../config"

export interface HttpError extends Error {
    httpCode: number
}


export class HttpError extends Error {
    httpCode : number;

    constructor(httpCode: number, message?: string) {
        super(message)
        this.httpCode = httpCode
    }
}

export function isHttpError (e: Error) : e is HttpError {
    return (e as any).httpCode !== undefined
} 

export default async function apifetch  (input: string, init?: RequestInit): Promise<Response> {

    const origHeaders = init && init.headers

    const postHeaders = init && ['POST','PUT','PATCH'].includes(init.method || 'GET')  && {
        'Content-Type':'application/json',
        'Accept':'application/json',
    } 

    const getHeaders = init && (!init.method || init.method === 'GET') && {
        'pragma':'no-cache',
        'cache-control':'no-store'
    } 

    const newInit : RequestInit = {
        ...init,
        headers: {
            ...postHeaders,
            ...getHeaders,
            ...origHeaders
        },
        credentials: 'include'
        
    }

    const response = await fetch(config.apiBaseUrl+input,newInit);

    if (!response.ok) {
        if (response.status >= 500)
            throw new HttpError(response.status,"Errore sul server")
        if (response.status >= 400 ) {
            const error = await response.json();
            throw new HttpError(response.status,error.messaggio)
        }
    }
    return response;
}