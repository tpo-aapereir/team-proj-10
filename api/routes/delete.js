const express = require('express')
const { Course, User } = require('../models')
const { asyncHandler } = require('../middleware/async-handler')
const { authenticateUser } = require('../middleware/auth-user')

const router = express.Router()

/**
 * DELETE route /courses/:id will delete the corresponding course and return a 204 HTTP status code and no content.
 */
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const course = await Course.findOne({
    where: { id: req.params.id },
    include: { model: User }
  })
  // Compares the email address passed in the header against the email address listed for the course owner
  if (req.currentUser.emailAddress === course.User.emailAddress) {
    await course.destroy()
    res.status(204).end()
  } else {
    res.status(403).json({ message: 'Access Denied' })
  }
}))

module.exports = router
