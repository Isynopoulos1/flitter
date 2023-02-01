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

// @route  PUT api/tweet
// @desc   Modify an existing tweet as a user
// @access Private
router.put("/api/tweet/:tweetId", isAuth, async (req, res) => {
  // TODO crate tweet
})

// @route  DELETE api/tweet
// @desc   delete a tweet as a user
// @access Private
router.delete("/api/tweet/:tweetId", isAuth, async (req, res) => {
  // TODO crate tweet
})

module.exports = router
