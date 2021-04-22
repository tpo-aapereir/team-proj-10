import React from 'react'
import { Redirect } from 'react-router-dom'

// HOC function
export function PrivateRoute (Component, authCreds) {
  if (authCreds.emailAddress) {
    return (<Component authCreds={authCreds} />)
  } else {
    return (<Redirect to='/signin' />)
  }
}

export default PrivateRoute
