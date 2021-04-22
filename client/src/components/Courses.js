import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import apiBaseUrl from '../config'

const Courses = () => {
  const [arrayOfCourses, setArrayOfCourses] = useState()
  const history = useHistory()

  // Get all course data, generates a module for each, then stores in state.
  useEffect(() => {
    const pullCourses = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/courses`)
        const gridOfCourses = Object.entries(response.data.courses).map(([key, value]) => {
          return (
            <Link to={`/courses/${value.id}`} key={value.id} className='course--module course--link'>
              <h2 className='course--label'>Course</h2>
              <h3 className='course--title'>{value.title}</h3>
            </Link>
          )
        })
        if (gridOfCourses.length > 0) {
          setArrayOfCourses(gridOfCourses)
        }
      } catch (error) {
        if (error.response.status === 500) {
          history.push('/error')
        }
        console.log(error)
      }
    }
    pullCourses()
  }, [history])

  // Returns main wrapper containing all courses and the new course button
  return (
    <main>
      <div className='wrap main--grid'>
        {arrayOfCourses}
        <Link to='/courses/create' className='course--module course--add--module'>
          <span className='course--add--title'>
            <svg
              version='1.1' xmlns='http://www.w3.org/2000/svg' x='0px' y='0px'
              viewBox='0 0 13 13' className='add'
            >
              <polygon points='7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 ' />
            </svg>
            New Course
          </span>
        </Link>
      </div>
    </main>
  )
}

export default Courses
