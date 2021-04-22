/* eslint-env jest */

import 'regenerator-runtime/runtime.js'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import Courses from '../components/Courses'

/**
 * Use async await and a promise based method findAllByText to render Courses and wait for the axios call to complete
 * prior to checking the element exists.
 */
describe('The Courses component', () => {
  describe('Renders', () => {
    let container

    beforeAll(async () => {
      await act(async () => {
        render(
          <Router>
            <Courses />
          </Router>
        )
      })
      await waitFor(() => screen.findAllByText('Course'))
      container = document.querySelector('.wrap.main--grid')
    })

    it('the new course anchor has correct class names', () => {
      const actual = container.querySelector('.course--add--module').className
      const expected = 'course--module course--add--module'
      expect(actual).toEqual(expected)
    })

    it('the first course href points to the correct url', () => {
      const actual = container.querySelector('a.course--link').href
      const expected = 'http://localhost/api/courses/1'
      expect(actual).toEqual(expected)
    })
  })
})
