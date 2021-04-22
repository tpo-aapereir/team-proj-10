import Cookies from 'js-cookie'

// Global singOut
export function signOut (setAuthCreds) {
  setAuthCreds([]); Cookies.remove('authenticatedUser')
}

// Global singIn
export function signIn (authUserData) {
  Cookies.set('authenticatedUser', JSON.stringify(authUserData), { expires: 1 })
}

/**
 * Used by UserSignIn, UserSignUp, UpdateCourse, and CreateCourse components to update state
 * @param {event}    e          contains the onChange event information
 * @param {object}   state     contains the state object to be updated
 * @param {function} setState  contains the function to update state
 */
export function inputChange (e, state, setState) {
  const { name, value } = e.target
  setState({ ...state, [name]: value })
}

/**
 * Function creates and returns an axios configuration object
 * @param {string} username contains the users email address
 * @param {string} password contains the users password
 * @param {string} url      contains the url axios will send the info to
 * @param {string} method   contains the type of request (get, put, post, delete)
 * @param {object} data     contains the data to be submitted to the database
 * Credit to srijan439 for the solution https://stackoverflow.com/questions/44072750/how-to-send-basic-auth-with-axios
 */
export function createConfig (username, password, url, method, data) {
  const token = `${username}:${password}`
  const encodedToken = Buffer.from(token).toString('base64')
  return { method, url, data, headers: { Authorization: 'Basic ' + encodedToken } }
}

export default createConfig
