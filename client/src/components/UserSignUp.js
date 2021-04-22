import React, { useEffect, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { inputChange } from '../Utilities'
import axios from 'axios'
import apiBaseUrl from '../config'
import Cookies from 'js-cookie'

const UserSignUp = (props) => {
  const [user, setUser] = useState({})
  const [errors, setErrors] = useState('')
  const history = useHistory()
  const { setAuthCreds } = props

  /**
   * Cleares errors and updates user state based on changes to input fields
   * @param {event} e contains the click event
   */
  const handleInputChange = (e) => {
    if (errors !== '') {
      setErrors('')
    }

    return inputChange(e, user, setUser)
  }

  /**
   * Submits new user info to be added to the database.
   * Returns the user to the previous page if they decide to cancel the sign up process.
   * @param {Event} e holds the click event
   */
  const handleSignUp = async (e) => {
    e.preventDefault()
    if (!errors) {
      try {
        await axios.post(`${apiBaseUrl}/users`, user)
        setAuthCreds(user)
        Cookies.set('authenticatedUser', JSON.stringify(user), { expires: 1 })
        history.goBack()
      } catch (error) {
        if (error.response.status === 500) {
          history.push('/error')
        } else {
          const err = error.response.data.errors.map((error, index) => <li key={index}>{error}</li>)
          setErrors(<p className='validation--errors'>{err}</p>)
        }
      }
    }
  }

  /**
   * Updates state with value from confirmPassword and password inputs. If an error was generated previously clears the error message.
   * @param {Event} e holds the change event.
   */
  useEffect(() => {
    if (user.confirmPassword !== user.password) {
      setErrors(<h3 className='validation--errors'>Passwords must match!</h3>)
    }
  }, [user])

  return (
    <main>
      <div className='form--centered'>
        <h2>Sign Up</h2>

        <ul>
          {errors}
        </ul>

        <form onSubmit={handleSignUp}>
          <label htmlFor='firstName'>First Name</label>
          <input id='firstName' name='firstName' type='text' autoFocus onChange={handleInputChange} value={user.firstName || ''} />

          <label htmlFor='lastName'>Last Name</label>
          <input id='lastName' name='lastName' type='text' onChange={handleInputChange} value={user.lastName || ''} />

          <label htmlFor='emailAddress'>Email Address</label>
          <input id='emailAddress' name='emailAddress' type='email' onChange={handleInputChange} value={user.emailAddress || ''} />

          <label htmlFor='password'>Password</label>
          <input id='password' name='password' type='password' onChange={handleInputChange} value={user.password || ''} />

          <label htmlFor='confirmPassword'>Confirm Password</label>
          <input id='confirmPassword' name='confirmPassword' type='password' onChange={handleInputChange} value={user.confirmPassword || ''} />

          <button className='button' type='submit'>Sign Up</button>
          <button className='button button-secondary' onClick={(e) => { e.preventDefault(); history.push('/') }}>Cancel</button>

        </form>

        <p>Already have a user account? Click here to <Link to='/signin'>sign in</Link>!</p>
      </div>
    </main>
  )
}

export default UserSignUp
