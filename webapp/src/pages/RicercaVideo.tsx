import * as React from 'react'
import { SelezionaVideoPerTitolo, SelezionaVideoPerGenere } from '../components/SelezionaVideo';
import { Layout } from '../components/Layout';

export const RicercaPerTitolo : React.FC = () => {
    return <Layout titolo="Ricerca per titolo">
            <SelezionaVideoPerTitolo/>
    </Layout>
}

export const RicercaPerGenere : React.FC = () => {
    return <Layout titolo="Ricerca per genere">
            <SelezionaVideoPerGenere psize={20}/>
    </Layout>
}
