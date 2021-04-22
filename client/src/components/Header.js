import React from 'react'
import { Link } from 'react-router-dom'

const Header = (props) => {
  const { authCreds } = props
  let userAccountElements

  // Generates signed out or signed in header based on presence of email address in authorization credentials.
  if (authCreds.emailAddress) {
    userAccountElements = (
      <ul className='header--signedin'>
        <li>Welcome, {authCreds.firstName} {authCreds.lastName}!</li>
        <li><Link to='/signout'>Sign Out</Link></li>
      </ul>
    )
  } else {
    userAccountElements = (
      <ul className='header--signedout'>
        <li><Link to='/signup'>Sign Up</Link></li>
        <li><Link to='/signin'>Sign In</Link></li>
      </ul>
    )
  }

  return (
    <header>
      <div className='wrap header--flex'>
        <h1 className='header--logo'><Link to='/'>Courses</Link></h1>
        <nav>

          {userAccountElements}

        </nav>
      </div>
    </header>
  )
}

export default Header
