import * as React from 'react';
import { User } from './api/LoginAPI';

export interface LoginContext {
    isLoggedIn: boolean,
    user?: User
}

export interface GlobalContext {
    login: LoginContext;
    setLogin: (login: LoginContext) => void;
}
const initialState = {
    login: {
        isLoggedIn:false
    },
    setLogin: () => {}
}

const GlobalContext = React.createContext<GlobalContext>(initialState);


export const useLogin = () => {
    const ctx = React.useContext(GlobalContext);
    return [ctx.login, ctx.setLogin] as [LoginContext,(v : LoginContext) => void]
}

export const GlobalContextProvider : React.FC = ({children}) => {
    const [state, setState] = React.useState<GlobalContext>({
        ...initialState,
        setLogin: (login) => {
            setState({...state,login})
        }
    })

    return <GlobalContext.Provider value={state}>
        {children}
    </GlobalContext.Provider>
}
