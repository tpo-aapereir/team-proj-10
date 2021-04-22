const express = require('express')
const { Course, User } = require('../models')
const { asyncHandler } = require('../middleware/async-handler')
const { authenticateUser } = require('../middleware/auth-user')

const router = express.Router()

/**
 * POST route /courses/ will create a new course, set the Location header to the URI for the newly created course,
 * and return a 201 HTTP status code and no content.
 */
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const course = await Course.findOne({
    where: { id: req.params.id },
    include: { model: User }
  })
  // Compares the email address passed in the header against the email address listed for the course owner
  if (req.currentUser.emailAddress === course.User.emailAddress) {
    await course.update(req.body)
    res.status(204).end()
  } else {
    res.status(403).json({ message: 'Access Denied' })
  }
}))

module.exports = router
