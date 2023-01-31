const express = require("express")

const isAuth = require("../../../middlewares/isAuth")

// DECLARE ROUTER
const router = express.Router()

// @route  GET api/user
// @desc   Get user info
// @access Private
router.get("/api/user", isAuth, async (req, res) => {
  // FINALIZE ENDPOINT
  res.json({ success: true, user: req.user })
})

module.exports = router
