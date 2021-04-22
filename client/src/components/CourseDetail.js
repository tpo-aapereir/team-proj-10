import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import createConfig from '../Utilities'
import apiBaseUrl from '../config'

function CourseDetail (props) {
  const [course, setCourse] = useState([])
  const [owner, setOwner] = useState('')
  const [authorizedLinks, setAuthorizedLinks] = useState('')
  const { id } = useParams()
  const { authCreds } = props
  const history = useHistory()

  // Gets course details and stores in state
  useEffect(() => {
    const pullCourses = async () => {
      try {
        const response = await axios(`${apiBaseUrl}/courses/${id}`)
        if (!response.data.course) {
          history.push('/notfound')
        }
        setCourse(response.data.course)
        setOwner(response.data.course.User)
      } catch (error) {
        console.log(error)
      }
    }
    pullCourses()
  }, [id, history])

  // Checks user credentials to determine if Update and Delete course buttons should be rendered and makes the handleDelete function available.
  useEffect(() => {
    const handleDelete = async (e) => {
      const axiosConfig = createConfig(authCreds.emailAddress, authCreds.password, `http://localhost:5000/api/courses/${id}`, 'delete')
      const confirmation = window.confirm('Do you want to delete this course?')
      if (confirmation) {
        try {
          await axios(axiosConfig)
          history.push('/')
        } catch (error) {
          console.log(error)
        }
      }
    }
    if (owner.emailAddress !== '' && authCreds.emailAddress && owner.emailAddress === authCreds.emailAddress) {
      setAuthorizedLinks(
        <>
          <Link to={`/courses/${id}/update`} className='button'>Update Course</Link>
          <button onClick={handleDelete} className='button'>Delete Course</button>
        </>
      )
    }
  }, [id, owner, authCreds, history])

  // Returns main wrapper with all course details and links based on if user is the owner of the course.
  return (
    <main>
      <div className='actions--bar'>
        <div className='wrap'>
          {authorizedLinks}
          <Link to='/' className='button button-secondary'>Return to List</Link>
        </div>
      </div>
      <div className='wrap'>
        <h2>Course Detail</h2>
        <form>
          <div className='main--flex'>
            <div>
              <h3 className='course--detail--title'>Course</h3>
              <h4 className='course--name'>{course.title}</h4>
              <p>By {owner.firstName} {owner.lastName}</p>
              <ReactMarkdown source={course.description} />
            </div>
            <div>
              <h3 className='course--detail--title'>Estimated Time</h3>
              <p>{course.estimatedTime}</p>

              <h3 className='course--detail--title'>Materials Needed</h3>
              <ul className='course--detail--list'>
                <ReactMarkdown source={course.materialsNeeded} />
              </ul>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}

export default CourseDetail
