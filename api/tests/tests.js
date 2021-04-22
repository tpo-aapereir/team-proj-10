/* eslint-env mocha */

const { expect } = require('chai')
const { Course, User } = require('../models')
const axios = require('axios')

/**
 * Function creates and returns an axios configuration object
 * @param {string} username contains the users email address
 * @param {string} password contains the users password
 * @param {string} url      contains the url axios will send the info to
 * @param {string} method   contains the type of request (get, put, post, delete)
 * @param {object} data     contains the data to be submitted to the database
 * Credit to srijan439 for the solution https://stackoverflow.com/questions/44072750/how-to-send-basic-auth-with-axios
 */
function createConfig (username, password, url, method, data) {
  const token = `${username}:${password}`
  const encodedToken = Buffer.from(token).toString('base64')
  return { method, url, data, headers: { 'Authorization': 'Basic '+ encodedToken } }
}

describe('The API exceeds expectations', () => {
  // Test user info
  const testFName = 'fName'
  const testLName = 'lName'
  const testEmail = 'test@email.com'
  const testPW = 'testPassword'

  // Joe's user info
  const joeEmail = 'joe@smith.com'
  const joePW = 'joepassword'
  const joeUserId = 1

  describe('USERS - test the users routes', () => {
    let res
    let authenticatedUser

    it('GET - /users/ route will return the currently authenticated user', async () => {
      const axiosConfig = createConfig(joeEmail, joePW, 'http://localhost:5000/api/users', 'get')
      authenticatedUser = await axios(axiosConfig)
      expect(authenticatedUser.data.user.emailAddress).to.equal(joeEmail)
    })

    it('GET - /users/ route will return a 200 status code', () => {
      expect(authenticatedUser.status).to.equal(200)
    })

    it('GET - /users/ route will NOT return the excluded attribute "password"', () => {
      expect(authenticatedUser.data.user).to.not.have.property('password')
    })

    it('GET - /users/ route will NOT return the excluded attribute "createdAt"', () => {
      expect(authenticatedUser.data.user).to.not.have.property('createdAt')
    })

    it('GET - /users/ route will NOT return the excluded attribute "updatedAt"', () => {
      expect(authenticatedUser.data.user).to.not.have.property('updatedAt')
    })

    it('POST - /users/ route will create a new user', async () => {
      let actual
      try {
        const data = {
          firstName: testFName,
          lastName: testLName,
          emailAddress: testEmail,
          password: testPW
        }
        res = await axios.post('http://localhost:5000/api/users', data)
        actual = await User.findOne({ where: { emailAddress: testEmail } })
        actual = actual.emailAddress
      } catch (error) {
        actual = error.message
      }
      expect(actual).to.equal(testEmail)
    })

    it('POST - /users/ route will set Location header to "/" after new user created', async () => {
      const actual = res.headers.location
      expect(actual).to.equal('/')
    })

    it('POST - /users/ route will return a 201 HTTP status code after new user created', async () => {
      const actual = res.status
      expect(actual).to.equal(201)
    })

    it('POST - Confirm test users password was hashed when added to database. Hashing handled in Users model.', async () => {
      let user
      let actual
      try {
        user = await User.findOne({ where: { emailAddress: testEmail } })
      } catch (error) {
        actual = error
      }
      expect(user.password).to.not.equal(testPW)
    })
  // USERS ends here
  })

  describe('COURSES - test the courses routes', () => {
    let res
    let courses
    let actual

    it('GET - /courses/ route will return all courses from the Courses database', async () => {
      try {
        courses = await Course.findAll({ include: { model: User } })
        res = await axios.get('http://localhost:5000/api/courses')
        actual = res.data.courses
      } catch (error) {
        actual = error.message
      }
      expect(actual[0].title).to.equal(courses[0].dataValues.title)
    })

    it('GET - /courses/ route will return a 200 status code', () => {
      expect(res.status).to.equal(200)
    })

    it('GET - /courses/ route will return the owner information with the course', () => {
      expect(actual[0].User.emailAddress).to.equal(courses[0].dataValues.User.dataValues.emailAddress)
    })

    it('GET - /courses/ route will NOT return the excluded attribute "password"', () => {
      expect(actual[0].User.password).to.be.undefined
    })

    it('GET - /courses/ route will NOT return the excluded attribute "createdAt"', () => {
      expect(actual[0].createdAt).to.be.undefined
    })

    it('GET - /courses/ route will NOT return the excluded attribute "updatedAt"', () => {
      expect(actual[0].updatedAt).to.be.undefined
    })

    it('GET - /courses/:id route will return specified course', async () => {
      try {
        courses = await Course.findOne({
          where: { id: 2 },
          include: { model: User }
        })
        res = await axios.get('http://localhost:5000/api/courses/2')
        actual = res.data.course.title
      } catch (error) {
        actual = error.message
      }
      expect(actual).to.equal(courses.dataValues.title)
    })

    it('GET - /courses/:id route will return a 200 status code', () => {
      expect(res.status).to.equal(200)
    })

    it('GET - /courses/:id route will return the owner information with the course', () => {
      expect(res.data.course.User.emailAddress).to.equal(courses.dataValues.User.dataValues.emailAddress)
    })

    it('GET - /courses/:id route will NOT return the excluded attributes', () => {
      expect(res.data.course.User.password).to.be.undefined
    })
    // GET COURSES STOP HERE

    // POST COURSES START HERE
    it('POST - /courses/ route will create a new course', async () => {
      let actual
      let data

      try {
        data = {
          title: 'First test course',
          description: 'this is a test course',
          estimatedTime: 'just a little while',
          materialsNeeded: 'bring yourself and a laptop',
          userId: joeUserId
        }
        const axiosConfig = createConfig(joeEmail, joePW, 'http://localhost:5000/api/courses', 'post', data)
        res = await axios(axiosConfig)
        actual = await Course.findOne({ where: { title: data.title } })
        actual = actual.title
      } catch (error) {
        actual = error.message
      }
      expect(actual).to.equal(data.title)
    })

    it('POST - /courses/ route will return a 201 status code if course creation successful', () => {
      expect(res.status).to.equal(201)
    })

    it('POST - /courses/ route will redirect to the new course id /api/courses/${newCourse.id}', async () => {
      const newCourse = await Course.findOne({ where: { title: 'First test course' }})
      expect(res.headers.location).to.equal(`/api/courses/${newCourse.id}`)
    })
    // POST Route STOPS here

    // PUT Route Starts Here
    it('PUT - /courses/:id route will return Access Denied if user NOT authorized to update', async () => {
      let actual
      let data
      try {
        data = await Course.findOne({ where: { title: 'First test course' } })
        data = data.dataValues
        data.description = 'The updated description'
        const axiosConfig = createConfig(testEmail, testPW, `http://localhost:5000/api/courses/${data.id}`, 'put', data)
        res = await axios(axiosConfig)
        actual = await Course.findOne({ where: { title: data.title } })
      } catch (error) {
        actual = error.response.data.message
        res = error.response
      }
      expect(actual).to.equal('Access Denied')
    })

    it('PUT - /courses/:id route will return a 403 status code if user NOT authorized to update', () => {
      expect(res.status).to.equal(403)
    })

    it('PUT - /courses/:id route will update the course description if user IS authorized to update', async () => {
      let actual
      let data
      try {
        data = await Course.findOne({ where: { title: 'First test course' } })
        data = data.dataValues
        data.description = 'The updated description'
        const axiosConfig = createConfig(joeEmail, joePW, `http://localhost:5000/api/courses/${data.id}`, 'put', data)
        res = await axios(axiosConfig)
        actual = await Course.findOne({ where: { title: data.title } })
        actual = actual.description
      } catch (error) {
        actual = error
      }
      expect(actual).to.equal(data.description)
    })

    it('PUT - /courses/:id route will return a 204 status code on successful update', () => {
      expect(res.status).to.equal(204)
    })
    // PUT Routes STOP Here

    // DELETE Routes START here
    it('DELETE - /courses/:id route will return Access Denied if user IS NOT authorized to delete', async () => {
      let actual
      let data
      try {
        data = await Course.findOne({ where: { title: 'First test course' } })
        const axiosConfig = createConfig(testEmail, testPW, `http://localhost:5000/api/courses/${data.id}`, 'delete')
        res = await axios(axiosConfig)
        actual = await Course.findOne({ where: { title: data.title } })
      } catch (error) {
        actual = error.response.data.message
        res = error.response
      }
      expect(actual).to.equal('Access Denied')
    })

    it('DELETE - /courses/:id route will return a 403 status code if user NOT authorized to delete', () => {
      expect(res.status).to.equal(403)
    })

    it('DELETE - /courses/:id route will delete a specified course if user IS authorized to delete', async () => {
      let actual
      let data
      try {
        data = await Course.findOne({ where: { title: 'First test course' } })
        const axiosConfig = createConfig(joeEmail, joePW, `http://localhost:5000/api/courses/${data.id}`, 'delete')
        res = await axios(axiosConfig)
        actual = await Course.findOne({ where: { title: data.title } })
      } catch (error) {
        actual = error.message
      }
      expect(actual).to.be.null
    })

    it('DELETE - /courses/:id route will return a 204 status code on sucessful course deletion', () => {
      expect(res.status).to.equal(204)
    })
    // DELETE Routes STOP here

  // COURSES ends here
  })

  describe('ERROR HANDLING - tests the error handling', () => {

    describe('Authentication Middleware Tests', () => {
      let actual

      it('GET - /users/ route will return access denied if authorization header not present', async () => {
        try {
          await axios.get('http://localhost:5000/api/users')
        } catch (error) {
          actual = error
        }
        expect(actual.response.data.message).to.equal('Access Denied')
      })

      it('GET - /users/ route will reutrn status 401 if authorization header not present', async () => {
        expect(actual.response.status).to.equal(401)
      })

      it('GET - /users/ route will return access denied if password is not correct', async () => {
        try {
          const axiosConfig = createConfig(testEmail, 'invalidPassword', `http://localhost:5000/api/users`, 'get')
          await axios(axiosConfig)
        } catch (error) {
          actual = error
        }
        expect(actual.response.data.message).to.equal('Access Denied')
      })

      it('GET - /users/ route will reutrn status 401 if password is not correct', async () => {
        expect(actual.response.status).to.equal(401)
      })

      it('GET - /users/ route will return access denied if username is not in the database', async () => {
        try {
          const axiosConfig = createConfig('invalid@invalid.com', 'invalidPassword', `http://localhost:5000/api/users`, 'get')
          await axios(axiosConfig)
        } catch (error) {
          actual = error
        }
        expect(actual.response.data.message).to.equal('Access Denied')
      })

      it('GET - /users/ route will reutrn status 401 if username is not in the database', async () => {
        expect(actual.response.status).to.equal(401)
      })
      // end of middleware tests
    })

    describe('Sequelize validation error tests', () => {
      let actual
      let data

      it('PUT - /courses/:id route - SequelizeValidationError "Description cannot be empty" thrown if "description" is blank', async () => {
        try {
          data = await Course.findOne({ where: { id: 1 } })
          data = data.dataValues
          data.description = ''
          const axiosConfig = createConfig(joeEmail, joePW, `http://localhost:5000/api/courses/${data.id}`, 'put', data)
          await axios(axiosConfig)
          actual = await Course.findOne({ where: { title: data.title } })
        } catch (error) {
          actual = error
        }
        expect(actual.response.data.errors[0]).to.equal('Description cannot be empty')
      })

      it('PUT - /courses/:id route - 400 status code thrown if "description" is blank', async () => {
        expect(actual.response.status).to.equal(400)
      })

      it('POST - /courses/ route - SequelizeValidationError "Description cannot be empty" thrown if "description" is blank', async () => {
        try {
          data = {
            title: 'First test course',
            description: '',
            estimatedTime: 'just a little while',
            materialsNeeded: 'bring yourself and a laptop',
            userId: 1
          }
          const axiosConfig = createConfig(joeEmail, joePW, 'http://localhost:5000/api/courses', 'post', data)
          await axios(axiosConfig)
        } catch (error) {
          actual = error
        }
        expect(actual.response.data.errors[0]).to.equal('Description cannot be empty')
      })

      it('POST - /courses/ route - 400 status code thrown if "description" is blank', async () => {
        expect(actual.response.status).to.equal(400)
      })

      it('POST - /users/ route - SequelizeValidationError "First name cannot be empty" thrown if "First name" is blank', async () => {
        try {
          const data = {
            firstName: '',
            lastName: testLName,
            emailAddress: testEmail,
            password: testPW
          }
          await axios.post('http://localhost:5000/api/users', data)
        } catch (error) {
          actual = error
        }
        expect(actual.response.data.errors[0]).to.equal('First Name cannot be empty')
      })

      it('POST - /users/ route - 400 status code thrown if "First name" is blank', async () => {
        expect(actual.response.status).to.equal(400)
      })

      it('POST - /users/ route - SequelizeValidationError "The email entered is already in use. Please use a different email or log in" thrown if email is already in database', async () => {
        try {
          const data = {
            firstName: testFName,
            lastName: testLName,
            emailAddress: testEmail,
            password: testPW
          }
          await axios.post('http://localhost:5000/api/users', data)
        } catch (error) {
          actual = error
        }
        expect(actual.response.data.errors[0]).to.equal('The email entered is already in use. Please use a different email or log in')
      })

      it('POST - /users/ route - 400 status code thrown if email exists in database when creating a new user', async () => {
        expect(actual.response.status).to.equal(400)
      })

      it('POST - /users/ route - SequelizeValidationError "Please enter a valid email address" thrown if email is already in database', async () => {
        try {
          const data = {
            firstName: testFName,
            lastName: testLName,
            emailAddress: 'invalidemail.com',
            password: testPW
          }
          await axios.post('http://localhost:5000/api/users', data)
        } catch (error) {
          actual = error
        }
        expect(actual.response.data.errors[0]).to.equal('Please enter a valid email address')
      })

      it('POST - /users/ route - 400 status code thrown if email exists in database when creating a new user', async () => {
        expect(actual.response.status).to.equal(400)
      })

      it('POST - /users/ route - SequelizeValidationError "Please enter a password " thrown if password is an empty string', async () => {
        try {
          const data = {
            firstName: testFName,
            lastName: testLName,
            emailAddress: 'valid@email.com',
            password: ''
          }
          await axios.post('http://localhost:5000/api/users', data)
        } catch (error) {
          actual = error
        }
        //console.log(actual.response.data)
        expect(actual.response.data.errors[0]).to.equal('Password cannot be empty')
      })

    // end of Sequalize validation error tests
    })
    // end of error handling tests
  })

  // CLEANUP - delete the test user and course if still exists in database
  after('delete the test user', async () => {
    const user = await User.findOne({ where: { emailAddress: testEmail } })
    user ? await user.destroy() : false
  })
  after('delete the test user', async () => {
    const user = await User.findOne({ where: { emailAddress: 'valid@email.com' } })
    user ? await user.destroy() : false
  })

  after('delete the test course', async () => {
    const course = await Course.findOne({ where: { title: 'First test course' } })
    course ? await course.destroy() : false
  })

// end of all encompassing describe
})
