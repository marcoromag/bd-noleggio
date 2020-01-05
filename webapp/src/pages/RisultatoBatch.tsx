import * as React from 'react'
import { Layout } from '../components/Layout'
import { BatchView } from '../components/BatchView'
import BatchAPI, { Batch } from '../api/BatchAPI';
import { Loading } from '../components/Loading';

export const RisultatoBatch : React.FC<{batch_id: string}> = ({batch_id}) => {
    const [batch, setBatch] = React.useState<Batch>();
    const [errore, setErrore] = React.useState<string>();

    React.useEffect( () => {
        BatchAPI.esito(batch_id)
        .then(setBatch)
        .catch(e => setErrore(e.message))
    },[batch_id])


    return <Layout titolo="Esito esecuzione batch" errore={errore}>
        {batch 
        ? <BatchView batch={batch}/>
        : <Loading/>
        }
    </Layout>
}