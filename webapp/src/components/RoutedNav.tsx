import * as React from 'react'
import { NavLinkProps, NavLink, DropdownItemProps, DropdownItem } from 'reactstrap'
import { useHistory } from 'react-router'

export const RoutedNavLink : React.FC<NavLinkProps> = ({href,children,...props}) => {
    const history = useHistory();
    const go = React.useCallback (() => {
        href && history.push(href);
    },[href,history])

    //@ts-ignore
    return <NavLink  onClick={go} {...props}>{children}</NavLink>
}

export const RoutedDropdownItem : React.FC<DropdownItemProps> = ({href,children,...props}) => {
    const history = useHistory();
    const go = React.useCallback (() => {
        href && history.push(href);
    },[href,history])

    //@ts-ignore
    return <DropdownItem  onClick={go} {...props}>{children}</DropdownItem>
}