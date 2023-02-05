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
  const userFields = { name: name.toLowerCase(), email: email.toLowerCase(), password }

  // CHECK IF EMAIL ALREADY EXIST
  const existingEmail = await User.findOne({ email: email.toLowerCase() })
  if (existingEmail) return res.status(400).json({ error: "Email already exist" })

  // CHECK IF EMAIL ALREADY EXIST
  const existingName = await User.findOne({ name: name.toLowerCase() })
  if (existingName) return res.status(400).json({ error: "Name already exist" })

  // SAVE USER TO DATABASE
  const user = await new User(userFields).save()

  const payload = {
    _id: user._id,
    name: user.name.toLowerCase(),
    email: user.email.toLowerCase(),
    followers: user.followers,
    date: user.date
  }

  req.session = {
    jwt: jwt.sign(payload, config.jwt_token)
  }

  // FINALIZE ENDPOINT
  res.status(201).json({ success: true, token: ["express:sess", `${Buffer.from(JSON.stringify(req.session)).toString("base64")}`], data: payload })
})

module.exports = router
