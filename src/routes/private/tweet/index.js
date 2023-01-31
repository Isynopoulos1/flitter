const express = require("express")

const isAuth = require("../../../middlewares/isAuth")

// DECLARE ROUTER
const router = express.Router()

// @route  POST api/tweet
// @desc   Create a tweet
// @access Private
router.post("/api/tweet", isAuth, async (req, res) => {
  // TODO crate tweet
})

module.exports = router
