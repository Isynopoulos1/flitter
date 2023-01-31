const express = require("express")
const db = require("mongoose")
const jwt = require("jsonwebtoken")

// IMPORT UTILS && MODELS
const User = require("../../../models/User")
const inputValidator = require("../../../validation/register")

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
  const user = await User.findOne({ email })
  if (user) return res.status(400).json({ error: "Email already exist" })

  // SAVE USER TO DATABASE
  await new User(userFields).save()

  // TODO AUTHENTIFY NEW USER

  // FINALIZE ENDPOINT
  res.json({ success: true })
})

module.exports = router
