/**
 * Executes async callback passed in. Errors are sent to the global error handler.
 * @param {async function} cb
 */
exports.asyncHandler = (cb) => {
  return async (req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (error) {
      // Forward error to the global error handler
      next(error)
    }
  }
}