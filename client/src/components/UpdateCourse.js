import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { createConfig, inputChange } from '../Utilities'
import axios from 'axios'
import apiBaseUrl from '../config'

function UpdateCourse (props) {
  const [course, setCourse] = useState('')
  const [owner, setOwner] = useState('')
  const [errors, setErrors] = useState('')
  const { authCreds } = props
  const { id } = useParams()
  const history = useHistory()

  /**
   * Creates axios configuration to update course data based on user input
   * @param {event} e Holds on click event information
   */
  const handleUpdate = async (e) => {
    e.preventDefault()
    const axiosConfig = createConfig(authCreds.emailAddress, authCreds.password, `${apiBaseUrl}/courses/${id}`, 'put', course)
    try {
      await axios(axiosConfig)
      history.push(`/courses/${id}`)
    } catch (error) {
      if (error.response.status === 500) {
        history.push('/error')
      }
      if (error.response.status === 403 || error.response.status === 401) {
        history.push('/forbidden')
      } else {
        const err = error.response.data.errors.map((error, index) => <li key={index}>{error}</li>)
        setErrors(<p className='validation--errors'>{err}</p>)
      }
    }
  }

  // Gets course data based on url id parameter and sets state
  useEffect(() => {
    const pullCourses = async () => {
      try {
        const response = await axios(`${apiBaseUrl}/courses/${id}`)
        if (!response.data.course) {
          history.push('/notfound')
        }
        if (response.data.course.User.emailAddress === authCreds.emailAddress) {
          setCourse(response.data.course)
          setOwner(response.data.course.User)
        } else {
          history.push('/forbidden')
        }
      } catch (error) {
        console.log(error)
      }
    }
    pullCourses()
  }, [id, authCreds.emailAddress, history])

  // Returns main wrapper with course data pulled from axios call.
  return (
    <main>
      <div className='wrap'>
        <h2>Update Course</h2>
        <ul>
          {errors}
        </ul>

        <form onSubmit={handleUpdate}>
          <div className='main--flex'>
            <div>
              <label htmlFor='courseTitle'>Course Title</label>
              <input id='courseTitle' name='title' type='text' autoFocus onChange={(e) => inputChange(e, course, setCourse)} value={course.title || ''} />

              <label htmlFor='courseAuthor'>Course Author</label>
              <input id='courseAuthor' name='author' type='text' readOnly value={`${owner.firstName || ''} ${owner.lastName || ''}`} />

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
          <button className='button' type='submit'>Update Course</button>
          <button className='button button-secondary' onClick={(e) => { e.preventDefault(); history.push(`/courses/${id}`) }}>Cancel</button>
        </form>
      </div>
    </main>
  )
}

export default UpdateCourse
