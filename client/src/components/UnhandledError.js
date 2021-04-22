import React from 'react'
import { useHistory } from 'react-router-dom'

const UnhandledError = () => {
  const history = useHistory()
  return (
    <main>
      <div className='wrap'>
        <h2>Error</h2>
        <p>Sorry! We just encountered an unexpected error.</p>
        <button className='button button-secondary' onClick={(e) => { e.preventDefault(); history.push('/') }}>Cancel</button>
      </div>
    </main>
  )
}

export default UnhandledError
