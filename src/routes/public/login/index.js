const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

// // IMPORT UTILS && MODELS
const User = require("../../../models/User")
const inputValidator = require("../../../validation/login")
const { config } = require("../../../../config")

// DECLARE ROUTER
const router = express.Router()

router.post("/api/login", async (req, res) => {
  // HANDLE BODY VALIDATION
  const { errors, isValid } = inputValidator(req.body)
  if (!isValid) return res.status(400).json(errors)

  // EXTRACT DATA
  const { name, password } = req.body

  // HANDLE EXISTING USER
  const user = await User.findOne({ name: name?.toLowerCase() })
  if (!user) return res.status(400).json({ error: "Invalid credentials" })

  // CHECK MATCH
  const match = await bcrypt.compareSync(password, user.passwordHash)

  if (match) {
    try {
      // CHECK IF EMAIL ALREADY EXIST
      const payload = {
        _id: user._id,
        name: user.name.toLowerCase(),
        email: user.email.toLowerCase(),
        avatar: user.avatar,
        followers: user.followers,
        date: user.date
      }

      req.session = {
        jwt: jwt.sign(payload, config.jwt_token)
      }

      // FINALIZE ENDPOINT
      res
        .status(201)
        .json({ success: true, token: ["express:sess", `${Buffer.from(JSON.stringify(req.session)).toString("base64")}`], data: payload })
    } catch (err) {
      const errors = handleErrors(err)
      res.status(400).json({ errors })
    }
  } else {
    return res.status(400).json({ error: "Invalid credentials" })
  }
})

module.exports = router
