import * as React from 'react'
import { Input, InputProps } from 'reactstrap'
import ConfigAPI, { Fornitore } from '../api/ConfigAPI';



export const SelectFornitore : React.FC<InputProps & {onLoadError?: (error: string) => void}> = ({onLoadError, ...rest}) => {
    const [listaFornitori, setFornitori] = React.useState<Fornitore[]>();

    React.useEffect( () => {
        ConfigAPI.listaFornitori().then (res => {
            setFornitori(res);
        }).catch(e => {
            onLoadError && onLoadError (e.message);
        })
    },[onLoadError])

    return  <Input {...rest} type="select">
        {listaFornitori && listaFornitori.map( f => <option key={f.id} value={f.id}>{f.nome}</option>)}
    </Input>
}
