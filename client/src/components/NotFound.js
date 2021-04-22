import React from 'react'
import { useHistory } from 'react-router-dom'

const NotFound = () => {
  const history = useHistory()
  return (
    <main>
      <div className='wrap'>
        <h2>Not Found</h2>
        <p>Sorry! We couldn't find the page you're looking for.</p>
        <button className='button button-secondary' onClick={(e) => { e.preventDefault(); history.push('/') }}>Go Back</button>
      </div>
    </main>
  )
}

export default NotFound
