const express = require("express")

const Tweet = require('../../../models/Tweet')
const isAuth = require("../../../middlewares/isAuth")
const inputValidator = require("../../../validation/tweet")

// DECLARE ROUTER
const router = express.Router()

// @route  POST api/tweet
// @desc   Create a tweet
// @access Private
router.post('/api/create-tweet', isAuth, async (req, res) => {
  // HANDLE BODY VALIDATION
  const { errors, isValid } = inputValidator(req.body)
  if (!isValid) return res.status(400).json(errors)

  // TODO GET AND EXTRACT VARIABLES
  const { text, tags } = req.body

  const tweet = await  new Tweet({
    postedBy: req.user._id,
    text,
    tags
  }).save()
  
  res.status(201).json({ 
    sucess: true, 
    message: 'Tweet created successfully', 
    tweet
  });
})

// @route  PUT api/tweet
// @desc   Modify an existing tweet as a user
// @access Private
router.put("/api/tweet-update/:tweetId", isAuth, async (req, res) => {
  // HANDLE BODY VALIDATION
  const { errors, isValid } = inputValidator(req.body)
  if (!isValid) return res.status(400).json(errors)


  // TODO GET AND EXTRACT VARIABLES
  const { text, tags } = req.body
  const { tweetId } = req.params


  // CHECK IF TWEET EXIST FOR THIS USER
  let tweet = await Tweet.findOne({ _id:tweetId, postedBy: req.user._id })
  if (!tweet) {
    return res.status(400).json({ error: "no tweet found for this user"})
  }

  const update = { text, tags }
  tweet = await tweet.set(update).save()
  
  res.status(200).json(tweet)
})

// @route  DELETE api/tweet
// @desc   delete a tweet as a user
// @access Private
router.delete("/api/delete-tweet/:tweetId", isAuth, async (req, res) => {
  // TODO GET AND EXTRACT VARIABLES
  const { tweetId } = req.params

 // CHECK IF TWEET EXIST FOR THIS USER
 let tweet = await Tweet.findOne({ _id:tweetId, postedBy: req.user._id })
 if (!tweet) {
   return res.status(400).json({ error: "no tweet found for this user"})
 }

  try{
    tweet = await Tweet.findOneAndRemove({ _id: tweetId })
      res.status(202).json({ sucess: true })
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
})

//@route POST api/tweet/:id/act
//@desc like and unlike action
//@access Private
//NEEDS TEST!
router.put("/api/like/:tweetId", isAuth, async (req, res) => {
  const filter = req.params.tweetId
  const update = {
    likes: req.user._id
  }

  let tweet = await Tweet.findOneAndUpdate(filter, update, {
    new: true
  })
  res.json(tweet)
})

module.exports = router
