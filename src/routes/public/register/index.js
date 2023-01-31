const express = require("express")
const jwt = require("jsonwebtoken")

// IMPORT UTILS && MODELS
const User = require("../../../models/User")
const inputValidator = require("../../../validation/register")
const { config } = require("../../../../config")

// DECLARE ROUTER
const router = express.Router()

// @route  POST api/register
// @desc   Register API main function
// @access Public
router.post("/api/register", async (req, res) => {
  // HANDLE BODY VALIDATION
  const { errors, isValid } = inputValidator(req.body)
  if (!isValid) return res.status(400).json(errors)

  // EXTRACT DATA
  const { name, email, password } = req.body
  const userFields = { name, email, password }

  // CHECK IF EMAIL ALREADY EXIST
  const existingUser = await User.findOne({ email: email.toLowerCase() })
  if (existingUser) return res.status(400).json({ error: "Email already exist" })

  // SAVE USER TO DATABASE
  const user = await new User(userFields).save()

  const payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    followers: user.followers,
    date: user.date
  }

  console.log(payload)

  req.session = {
    jwt: jwt.sign(payload, config.jwt_token)
  }

  // FINALIZE ENDPOINT
  res.status(201).json({ success: true, token: "Bearer " + req.session.jwt })
})

module.exports = router
