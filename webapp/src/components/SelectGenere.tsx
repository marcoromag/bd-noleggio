import * as React from 'react'
import { Input, InputProps } from 'reactstrap'
import ConfigAPI, { Fornitore, Genere } from '../api/ConfigAPI';



export const SelectGenere : React.FC<InputProps & {onLoadError?: (error: string) => void}> = ({onLoadError, value, ...rest}) => {
    const [listaGeneri, setGeneri] = React.useState<Genere[]>();

    React.useEffect( () => {
        ConfigAPI.listaGeneri().then (res => {
            setGeneri(res);
        }).catch(e => {
            onLoadError && onLoadError (e.message);
        })
    },[])

    return  <Input {...rest} type="select" value={value}>
        {!value && <option>---</option>}
        {listaGeneri && listaGeneri.map( f => <option key={f.id} value={f.id}>{f.nome}</option>)}
    </Input>
}
