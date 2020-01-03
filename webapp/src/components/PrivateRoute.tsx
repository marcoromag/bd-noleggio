import * as React from 'react'
import { Route, RouteProps, Redirect } from 'react-router'
import { useLogin } from '../GlobalContext'

export const PrivateRoute : React.FC<RouteProps> = ({ children, render, component, ...rest }) => {
    const [login] = useLogin()
    return (
      <Route
        {...rest}
        render={(props) =>
          login.isLoggedIn ? (
            (render &&  render(props))
            || (component && React.createElement(component))  
            ||children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    )
}