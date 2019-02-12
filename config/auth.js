const jwt = require('jsonwebtoken')

// middleware for auth protected server routes
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_TOKEN)
    req.token = decoded
    next()
  } catch (error) {
    return res.status(400).send({
      error,
      message: 'Authentication Failed'
    })
  }
}
