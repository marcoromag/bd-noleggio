import * as React from 'react';
import { useLogin } from '../GlobalContext';

export const Header : React.FC = () => {
    const [login] = useLogin();
    return <div>header {login.isLoggedIn  ? "logged in": "not logged in"}</div>;
}