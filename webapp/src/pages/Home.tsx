import * as React from 'react'
import { Layout } from '../components/Layout'
import { useLogin } from '../GlobalContext'

const Homepage : React.FC = () => {
    const [login] = useLogin();
    return <Layout titolo="Home">
        <p>Benvenuto <strong>{login.user!.nome}</strong></p> 
        <p>Usa le opzioni nel menu per accedere alle funzioni disponibili per te</p>
    </Layout>
} 