const express = require('express')
const { Course, User } = require('../models')
const { asyncHandler } = require('../middleware/async-handler')
const { authenticateUser } = require('../middleware/auth-user')
const bcrypt = require('bcryptjs')

const router = express.Router()

/**
 * POST route /users/ will create a new user, set the Location header to "/", and return a 201 HTTP status code and no content.
 */
router.post('/users', asyncHandler(async (req, res) => {
  let { firstName, lastName, emailAddress, password } = req.body

  /**
   * Skip trimming and hashing if password is undefined on the req.body.
   * If password consists only of space characters trim it down to an empty string and skip hashing.
   */
  if (password) {
    if (password.trim() === '') {
      password = password.trim()
    } else {
      password = bcrypt.hashSync(password, 10)
    }
  }

  await User.create({ firstName, lastName, emailAddress, password })
  res.redirect(201, '/')
}))

/**
 * POST route /courses/ will create a new course, set the Location header to the URI for the newly created course,
 * and return a 201 HTTP status code and no content.
 */
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  let { title, author, description, estimatedTime, materialsNeeded, userId } = req.body

  // Update userId submitted by client to match database
  userId = req.currentUser.id

  const course = await Course.create({ title, author, description, estimatedTime, materialsNeeded, userId })
  res.redirect(201, `/api/courses/${course.id}`)
}))

module.exports = router
