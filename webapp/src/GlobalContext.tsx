import * as React from 'react';
import LoginAPI, { User } from './api/LoginAPI';
import { Loading } from './components/Loading';
import { Layout } from './components/Layout';

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
    const [isLoading, setLoading] = React.useState(true);
    const [state, setState] = React.useState<GlobalContext>({
        ...initialState,
        setLogin: (login) => {
            setState({...state,login})
        }
    })

    React.useEffect( () => {
        LoginAPI.user().then ( user => {
            setState({
                ...state,
                login: {
                    isLoggedIn:true,
                    user
                }
            })
            setLoading(false);
        })
        .catch( () => {
            setState({
                ...state,
                login: {isLoggedIn:false}
            })
            setLoading(false);
        })
    },[])

    return <GlobalContext.Provider value={state}>
        {isLoading ? <Layout><Loading/></Layout> : children}
    </GlobalContext.Provider>
}
