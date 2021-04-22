import React from 'react'
import { useHistory } from 'react-router-dom'

const Forbidden = () => {
  const history = useHistory()

  return (
    <main>
      <div className='wrap'>
        <h2>Forbidden</h2>
        <p>Oh oh! You can't access this page.</p>
        <button className='button button-secondary' onClick={(e) => { e.preventDefault(); history.push('/') }}>Go Back</button>
      </div>
    </main>
  )
}

export default Forbidden
