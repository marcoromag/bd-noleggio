import * as React from 'react'
import { Layout } from '../components/Layout'
import { SelezionaCliente } from '../components/SelezionaCliente'
import { useHistory } from 'react-router'
import { Cliente } from '../api/ClienteAPI'



export const RicercaCliente : React.FC = () => {
    const history = useHistory();
    const selectCliente = React.useCallback ((cliente: Cliente) => {
        history.push(`/cliente/${cliente.cod_fiscale}`)
    },[history])

    return <Layout titolo="Ricerca cliente"
    headline="Ricerca un cliente per andare alla sua pagina di dettaglio."
    >
            <SelezionaCliente onSelect={selectCliente} />
    </Layout>
}
