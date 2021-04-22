/* eslint-env jest */

import 'regenerator-runtime/runtime.js'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import CreateCourse from '../components/CreateCourse'
import userEvent from '@testing-library/user-event'

describe('The Create Course component', () => {
  describe('Renders', () => {
    let container

    beforeAll(() => {
      render(
        <Router>
          <CreateCourse authCreds={{ emailAddress: 'joe@smith.com', firstName: 'Joe', lastName: 'Smith' }} />
        </Router>
      )
      waitFor(() => screen.findAllByText('Create'))
      container = document.querySelector('div.wrap')
    })
    it('the correct course author loads', () => {
      const actual = container.querySelector('input#courseAuthor').value
      const expected = 'Joe Smith'
      expect(actual).toEqual(expected)
    })
  })
})
