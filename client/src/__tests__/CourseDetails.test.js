/* eslint-env jest */

import 'regenerator-runtime/runtime.js'
import React from 'react'
import { Router, Route } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import CourseDetail from '../components/CourseDetail'
import { createMemoryHistory } from 'history'

/**
 * Render's component with specified history and path values
 */
function renderWithRouterMatch (credentials, route) {
  const path = '/courses/:id'
  const hist = createMemoryHistory({ initialEntries: [route] })

  return {
    ...render(
      <Router history={hist}>
        <Route path={path} render={() => <CourseDetail authCreds={credentials} />} />
      </Router>
    )
  }
}

/**
 * Use async await and a promise based method findAllByText to render Courses and wait for the axios call to complete
 * prior to checking the element exists.
 */
describe('The Courses component', () => {
  describe('Renders', () => {
    let container

    beforeAll(async () => {
      renderWithRouterMatch({ emailAddress: 'joe@smith.com' }, '/courses/1')
      await waitFor(() => screen.findAllByText('By Joe Smith'))
      container = document.querySelector('main')
    })

    it('the correct course title', async () => {
      const actual = container.querySelector('h4.course--name').innerHTML
      const expected = 'Build a Basic Bookcase'
      expect(actual).toEqual(expected)
    })

    it('the update button exists for owner', async () => {
      const actual = container.querySelector('a.button').innerHTML
      const expected = 'Update Course'
      expect(actual).toEqual(expected)
    })

    it('the update button does not exist for non-owners', async () => {
      renderWithRouterMatch({ emailAddress: 'joe@smith.com' }, '/courses/2')
      await waitFor(() => screen.findAllByText('By Sally Jones'))
      const actual = document.querySelector('a.button').innerHTML
      const expected = 'Return to List'
      expect(actual).toEqual(expected)
    })
  })
})
