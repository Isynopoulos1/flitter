const express = require("express")

const Tweet = require('../../../models/Tweet')

const isAuth = require("../../../middlewares/isAuth")

// DECLARE ROUTER
const router = express.Router()

// @route  POST api/tweet
// @desc   Create a tweet
// @access Private
router.post('/api/create-tweet', isAuth, async (req, res) => {
  if (isAuth) {
    const tweet = new Tweet({
      _author: req.body._author,
      text: req.body.text
    }) 
  
    const result = await tweet.save()
    
    res.status(201).json({ 
      sucess: true, 
      message: 'Tweet created successfully', 
      tweet: result
    });
  }
})

// @route  PUT api/tweet
// @desc   Modify an existing tweet as a user
// @access Private
router.put("/api/tweet-update/:tweetId", isAuth, async (req, res) => {
  const filter = req.params.tweetId
  const update = {
    text: req.body.text
  }

  let tweet = await Tweet.findOneAndUpdate(filter, update, {
    new: true
  })
  res.json(tweet)
})

// @route  DELETE api/tweet
// @desc   delete a tweet as a user
// @access Private
router.delete("/api/delete-tweet/:tweetId", isAuth, async (req, res) => {
  try{
    const tweet = await Tweet.findOneAndRemove(req.param.tweetId)
      res.json({ sucess: true })
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
