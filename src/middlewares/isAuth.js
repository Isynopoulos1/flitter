module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ error: "Not authorized" })
  }
  next()
}
