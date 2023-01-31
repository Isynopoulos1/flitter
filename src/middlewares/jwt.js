const jwt = require("jsonwebtoken")
const { config } = require("../../config")

module.exports = (req, res, next) => {
  if (!req.session || !req.session.jwt) {
    return next()
  }
  try {
    const payload = jwt.verify(req.session.jwt, config.jwt_token)
    req.user = payload
  } catch (e) {
    return next()
  }

  next()
}
