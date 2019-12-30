import * as React from 'react'
import { Route, RouteProps, Redirect } from 'react-router'
import { useLogin } from '../GlobalContext'

export const PrivateRoute : React.FC<RouteProps> = ({ children, ...rest }) => {
    const [login] = useLogin()
    return (
      <Route
        {...rest}
        render={({ location }) =>
          login.isLoggedIn ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    )
}