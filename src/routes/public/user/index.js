const express = require("express")
const User = require("../../../models/User")

// DECLARE ROUTER
const router = express.Router()

// @route  GET api/users
// @desc   Get all users
// @access Public
router.get("/api/users", async (req, res) => {
  const users = await User.find()
  return res.status(200).json({ users })
})

// @route  GET api/user/:name
// @desc   Get user profile info
// @access Public
router.get("/api/user/:name", async (req, res) => {
  const { name } = req.params
  const user = await User.findOne({ name: name })
  return res.status(200).json({ user })
})

module.exports = router
