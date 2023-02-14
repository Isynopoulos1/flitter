const express = require("express")

const Tweet = require("../../../models/Tweet")
const isAuth = require("../../../middlewares/isAuth")
const inputValidator = require("../../../validation/tweet")

// DECLARE ROUTER
const router = express.Router()

// @route  POST api/tweet
// @desc   Create a tweet
// @access Private
router.post("/api/create-tweet", isAuth, async (req, res) => {
  // HANDLE BODY VALIDATION
  const { errors, isValid } = inputValidator(req.body)
  if (!isValid) return res.status(400).json(errors)

  // GET AND EXTRACT VARIABLES
  const { text, tags } = req.body

  const tweet = await new Tweet({
    postedBy: req.user._id,
    text,
    tags
  }).save()

  res.status(201).json({
    sucess: true,
    message: "Tweet created successfully",
    tweet
  })
})

// @route  PUT api/tweet
// @desc   Modify an existing tweet as a user
// @access Private
router.put("/api/tweet-update/:tweetId", isAuth, async (req, res) => {
  // HANDLE BODY VALIDATION
  const { errors, isValid } = inputValidator(req.body)
  if (!isValid) return res.status(400).json(errors)

  // GET AND EXTRACT VARIABLES
  const { text, tags } = req.body
  const { tweetId } = req.params

  // CHECK IF TWEET EXIST FOR THIS USER
  let tweet = await Tweet.findOne({ _id: tweetId, postedBy: req.user._id })
  if (!tweet) {
    return res.status(400).json({ error: "no tweet found for this user" })
  }

  const update = { text, tags }
  tweet = await tweet.set(update).save()

  res.status(200).json(tweet)
})

// @route  DELETE api/tweet
// @desc   delete a tweet as a user
// @access Private
router.delete("/api/delete-tweet/:tweetId", isAuth, async (req, res) => {
  // GET AND EXTRACT VARIABLES
  const { tweetId } = req.params

  // CHECK IF TWEET EXIST FOR THIS USER
  let tweet = await Tweet.findOne({ _id: tweetId, postedBy: req.user._id })
  if (!tweet) {
    return res.status(400).json({ error: "no tweet found for this user" })
  }

  try {
    tweet = await Tweet.findOneAndRemove({ _id: tweetId })
    res.status(202).json({ sucess: true })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// @route  PATCH api/tweet/:id/like
// @desc   Like or Unlike tweet as a user
// @access Private
router.patch("/api/tweet/:id/like", isAuth, async (req, res) => {
  try {
    // DEFINE VARIABLES
    const { id } = req.params
    const { _id: userId } = req.user

    const tweet = await Tweet.findById(id)
    if (!tweet) return res.status(404).send("No tweet found with that ID")

    // FOLLOW OR UNFOLLOW
    const indexOfUser = tweet.likes.findIndex((f) => f.toString() === userId.toString())
    indexOfUser === -1 ? tweet.likes.unshift(userId) : tweet.likes.splice(indexOfUser, 1)

    await tweet.save()
    return res.status(200).json(tweet)
  } catch (err) {
    res.status(400).send(err)
  }
})

module.exports = router
