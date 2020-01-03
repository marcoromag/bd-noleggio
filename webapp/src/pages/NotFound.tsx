import * as React from 'react'
import { Layout } from '../components/Layout'
import { Link } from 'react-router-dom'

export const NotFound : React.FC = () => <Layout titolo="Pagina non trovata">
    <Link to="/">Clicca qui per tornare alla home page</Link>
</Layout>