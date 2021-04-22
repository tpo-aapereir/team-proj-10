import React from 'react'
import { useHistory } from 'react-router-dom'
import { signOut } from '../Utilities'

const UserSignOut = (props) => {
  const history = useHistory()
  signOut(props.setAuthCreds)
  history.push('/')
  return (<main><h1>Signing Out...</h1></main>)
}

export default UserSignOut
