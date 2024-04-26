import React, { FC, ReactElement } from 'react'
import { Redirect, Route } from 'react-router-dom'

interface IProtectedRoute {
  path: string
  exact: boolean
  children: ReactElement
  isLoggedIn: boolean
  pathRest: string
}
const ProtectedRoute: FC<IProtectedRoute> = ({ isLoggedIn, children, pathRest }) => {
  return (
    <Route
      render={({ location }) =>
        isLoggedIn
          ? (
              children
            )
          : (
            <Redirect to={{ pathname: `/${pathRest}/autorization`, state: { from: location } }} />
            )
      }
    />
  )
}
export default ProtectedRoute
