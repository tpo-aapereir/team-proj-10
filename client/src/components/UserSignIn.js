import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { createConfig, inputChange, signIn } from '../Utilities'
import axios from 'axios'
import apiBaseUrl from '../config'

const UserSignIn = (props) => {
  const [signInInput, setSignInInput] = useState({ emailAddress: '', password: '' })
  const [errors, setErrors] = useState('')
  const { setAuthCreds } = props
  const history = useHistory()

  /**
   * Sends a get requests to verify user email address and password exist in the database.
   * If successful sets state in app.js to hold credentials.
   * @param {event} e Holds on click event data
   */
  const handleSignIn = async (e) => {
    e.preventDefault()
    const { emailAddress, password } = signInInput
    const axiosConfig = createConfig(emailAddress, password, `${apiBaseUrl}/users`, 'GET')
    try {
      const response = await axios(axiosConfig)
      const authUserData = { password, ...response.data.user }
      setAuthCreds(authUserData)
      signIn(authUserData)
      history.goBack()
    } catch (error) {
      if (error.response.status === 500) {
        history.push('/error')
      } else {
        setErrors(<h3 className='validation--errors'>Sign-in was unsuccessful.</h3>)
      }
    }
  }

  /**
   * Updates state with input from email address and password inputs. If an error was generated previously clears the error message.
   * @param {Event} e
   */
  const handleInputChange = (e) => {
    if (errors !== '') {
      setErrors('')
    }
    return inputChange(e, signInInput, setSignInInput)
  }

  return (
    <div className='form--centered'>
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <label htmlFor='emailAddress'>Email Address</label>
        <input id='emailAddress' name='emailAddress' type='email' autoFocus onChange={handleInputChange} value={signInInput.emailAddress} />
        <label htmlFor='password'>Password</label>
        <input id='password' name='password' type='password' onChange={handleInputChange} value={signInInput.password} />

        {errors}

        <button className='button' type='submit'>
          Sign In
        </button>
        <a className='button button-secondary' href='/'>
          Cancel
        </a>

      </form>
      <p>Don't have a user account? Click here to <a href='/signup'>sign up</a>!</p>
    </div>
  )
}

export default UserSignIn
