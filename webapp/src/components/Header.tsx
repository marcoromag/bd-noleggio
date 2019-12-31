import * as React from 'react';
import { useLogin } from '../GlobalContext';
import { Nav, NavItem, Navbar, NavbarBrand, NavbarToggler, UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu, Collapse } from 'reactstrap';
import { RoutedNavLink, RoutedDropdownItem } from './RoutedNav';
import LoginAPI from '../api/LoginAPI';

export const Header : React.FC = () => {
    const [login,setLogin] = useLogin();
    const [isOpen, setIsOpen] = React.useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const logoutClick = React.useCallback( async ()=>{    
        try {
            await LoginAPI.logout();
        } finally 
        {
            setLogin({isLoggedIn:false, user:undefined});
        }
    },[setLogin])

    const isAdmin = login.isLoggedIn && login.user && login.user.tipo === 'DIRIGENTE';
    const isOper = login.isLoggedIn && login.user;

    return <Navbar color="light" light expand="md">
        <NavbarBrand><i className="fas fa-cat fa-3x"></i></NavbarBrand>
        <NavbarToggler onClick={toggle} />
       <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <RoutedNavLink href="/components">Components</RoutedNavLink>
            </NavItem>
            {isOper && <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>Ricerca</DropdownToggle>
              <DropdownMenu right>
                <RoutedDropdownItem href="/ricerca/titolo">Ricerca per titolo</RoutedDropdownItem>
                <DropdownItem divider />
                <RoutedDropdownItem href="/ricerca/genere">Ricerca per genere</RoutedDropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            }
            {isOper && 
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Noleggio
              </DropdownToggle>
              <DropdownMenu right>
                <RoutedDropdownItem href="/nuovocliente">Nuovo cliente</RoutedDropdownItem>
                <DropdownItem divider/>
                <RoutedDropdownItem href="/noleggio/attiva">Crea contratto di noleggio</RoutedDropdownItem>
                <DropdownItem divider/>
                <RoutedDropdownItem href="/noleggio/termina">Termina contratto di noleggio</RoutedDropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            }
            {isAdmin && 
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>Batch</DropdownToggle>
              <DropdownMenu right>
                <RoutedDropdownItem href="/batch/carico">Carico</RoutedDropdownItem>
                <DropdownItem divider />
                <RoutedDropdownItem href="/batch/scarico">Scarico</RoutedDropdownItem>
                <DropdownItem divider />
                <RoutedDropdownItem href="/batch/carico">Mostra tutte le attività batch</RoutedDropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            }
          </Nav>
          {isOper && 
          <Nav navbar>
            <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
            <i className="far fa-user-circle"></i>{login.user!.nome} {login.user!.cognome}
            </DropdownToggle>
            <DropdownMenu right>
            <DropdownItem onClick={logoutClick}>Log out</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          </Nav>
          }
        </Collapse>
      </Navbar>
}