import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { createConfig, inputChange } from '../Utilities'
import axios from 'axios'
import apiBaseUrl from '../config'

function CreateCourse (props) {
  const { authCreds } = props
  const [course, setCourse] = useState({ userId: authCreds.id })
  const [errors, setErrors] = useState('')
  const history = useHistory()

  /**
   * Creates an axois config object to submit a new course to the API.
   * @param {event} e Holds the onSubmit event
   */
  const handleCreate = async (e) => {
    e.preventDefault()
    const axiosConfig = createConfig(authCreds.emailAddress, authCreds.password, `${apiBaseUrl}/courses`, 'post', course)
    try {
      await axios(axiosConfig)
      history.push('/')
    } catch (error) {
      if (error.response.status === 500) {
        history.push('/error')
      } else {
        const err = error.response.data.errors.map((error, index) => <li key={index}>{error}</li>)
        setErrors(
          <div className='validation--errors'>
            <h3>Validation Errors</h3>
            <ul>
              {err}
            </ul>
          </div>
        )
      }
    }
  }

  // Returns main wrapper with inputs for each course field.
  return (
    <main>
      <div className='wrap'>
        <h2>Create Course</h2>
        {errors}
        <form onSubmit={handleCreate}>
          <div className='main--flex'>
            <div>
              <label htmlFor='courseTitle'>Course Title</label>
              <input id='courseTitle' name='title' type='text' autoFocus onChange={(e) => inputChange(e, course, setCourse)} value={course.title || ''} />

              <label htmlFor='courseAuthor'>Course Author</label>
              <input id='courseAuthor' name='author' type='text' readOnly value={`${authCreds.firstName} ${authCreds.lastName}`} />

              <label htmlFor='courseDescription'>Course Description</label>
              <textarea id='courseDescription' name='description' onChange={(e) => inputChange(e, course, setCourse)} value={course.description || ''} />
            </div>
            <div>
              <label htmlFor='estimatedTime'>Estimated Time</label>
              <input id='estimatedTime' name='estimatedTime' type='text' onChange={(e) => inputChange(e, course, setCourse)} value={course.estimatedTime || ''} />

              <label htmlFor='materialsNeeded'>Materials Needed</label>
              <textarea id='materialsNeeded' name='materialsNeeded' onChange={(e) => inputChange(e, course, setCourse)} value={course.materialsNeeded || ''} />
            </div>
          </div>
          <button className='button' type='submit'>Create Course</button>
          <button className='button button-secondary' onClick={(e) => { e.preventDefault(); history.push('/') }}>Cancel</button>
        </form>
      </div>
    </main>
  )
}

export default CreateCourse
