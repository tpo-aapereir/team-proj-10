/* eslint-env jest */

import 'regenerator-runtime/runtime.js'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import Header from '../components/Header'

describe('The Header component', () => {
  describe('Renders', () => {
    let container

    beforeAll(async () => {
      await act(async () => {
        render(
          <Router>
            <Header authCreds={{ emailAddress:'joe@smith.com', firstName: 'Joe', lastName: 'Smith' }} />
          </Router>
        )
      })
      await waitFor(() => screen.findAllByText('Courses'))
      container = document.querySelector('div.wrap.header--flex')
    })

    it('the nav header will reflect signed in classname', () => {
      const actual = container.querySelector('.header--signedin').className
      const expected = 'header--signedin'
      expect(actual).toEqual(expected)
    })
  })

  describe('Renders', () => {
    let container

    beforeAll(async () => {
      await act(async () => {
        render(
          <Router>
            <Header authCreds={{}} />
          </Router>
        )
      })
      await waitFor(() => screen.findAllByText('Courses'))
      container = document.querySelector('div.wrap.header--flex')
    })

    it('the nav header will reflect signed in classname', () => {
      const actual = container.querySelector('.header--signedout').className
      const expected = 'header--signedout'
      expect(actual).toEqual(expected)
    })
  })
})
