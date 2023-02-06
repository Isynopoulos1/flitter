const express = require("express")

const Tweet = require("../../../models/Tweet")

// DECLARE ROUTER
const router = express.Router()

// @route  GET api/tweet
// @desc   Get all tweets sort cronologically limit to 20 tweets.
// @access Public
router.get("/api/tweets", async (req, res) => {
  try {
    const tweets = await Tweet.find().limit(20).sort({ date: -1 })
    res.json(tweets)
  } catch (err) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
