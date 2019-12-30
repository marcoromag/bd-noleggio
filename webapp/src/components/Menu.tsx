import * as React from 'react';
import { Nav, NavItem } from 'reactstrap';
import { useLogin } from '../GlobalContext';
import { Link } from 'react-router-dom';

const MenuAmministratore : React.FC = () => {
    return <Nav vertical>
    <NavItem>
        <h1>Direttore</h1>
    </NavItem>
    <NavItem>
        Statistiche vendite
    </NavItem>
    <NavItem>
        <Link to="/dirigente/batch/carico">Batch di carico</Link> 
    </NavItem>
    <NavItem>
        <Link to="/dirigente/batch/scarico">Batch di scarico</Link> 
    </NavItem>
</Nav>;
}

const MenuAddetto : React.FC = () => {
    return <Nav vertical>
        <NavItem>
            <h1>Addetto</h1>
        </NavItem>
        <NavItem>
            <Link to="/ricerca/titolo">Ricerca per titolo</Link>
        </NavItem>
        <NavItem>
            Ricerca per genere
        </NavItem>
        <NavItem>
            Crea nuovo noleggio
        </NavItem>
        <NavItem>
            Termina un noleggio
        </NavItem>
    </Nav>;
}

export const Menu : React.FC = () => {
    const [login] = useLogin();

    if (!login.isLoggedIn) return null;
    if (login.user && login.user.tipo === 'DIRIGENTE') {
        return <>
            <MenuAmministratore/>
            <MenuAddetto/>
        </>
    }
    return <MenuAddetto/>
}