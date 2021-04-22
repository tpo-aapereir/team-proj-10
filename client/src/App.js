import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import Cookies from 'js-cookie'

import Courses from './components/Courses'
import UserSignIn from './components/UserSignIn'
import UserSignUp from './components/UserSignUp'
import UserSignOut from './components/UserSignOut'
import CourseDetail from './components/CourseDetail'
import UpdateCourse from './components/UpdateCourse'
import CreateCourse from './components/CreateCourse'
import Header from './components/Header'
import PrivateRoute from './PrivateRoute'
import Forbidden from './components/Forbidden'
import NotFound from './components/NotFound'
import UnhandledError from './components/UnhandledError'

function App () {
  // global authentication state and sets the state based on the cookie
  const [authCreds, setAuthCreds] = useState(Cookies.getJSON('authenticatedUser') || [])
  // global sign in and sign out housed in Utilities.js

  return (
    <Router>

      <Header authCreds={authCreds} setAuthCreds={setAuthCreds} />

      <Switch>
        <Redirect exact path='/' to='/courses' />
        <Route exact path='/courses' component={Courses} />
        <Route exact path='/courses/create' render={() => PrivateRoute(CreateCourse, authCreds)} />
        <Route exact path='/courses/:id/update' render={() => PrivateRoute(UpdateCourse, authCreds)} />
        <Route exact path='/courses/:id' render={() => <CourseDetail authCreds={authCreds} />} />

        <Route exact path='/signin' render={() => <UserSignIn setAuthCreds={setAuthCreds} />} />
        <Route exact path='/signup' render={() => <UserSignUp setAuthCreds={setAuthCreds} />} />
        <Route exact path='/signout' render={() => <UserSignOut setAuthCreds={setAuthCreds} />} />

        <Route exact path='/forbidden' component={Forbidden} />
        <Route exact path='/error' component={UnhandledError} />
        <Route path='/notfound' component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

export default App
