const express = require("express")
const Tweet = require("../../../models/Tweet")
const isAuth = require("../../../middlewares/isAuth")

// DECLARE ROUTER
const router = express.Router()

// @route  POST api/tweet
// @desc   Create a tweet
// @access Private
router.post("/api/tweet", isAuth, async (req, res) => {
  const tweet = new Tweet({
    text: req.body.text,
    _author: req.user,
    tags: req.body.tags
  })
  
  try {
    await tweet.save()
    res.status(201).json({ success: true, msg: "Tweet added successfully" })
  } catch (err) {
    res.status(400).send(err)
  }
})

// @route  PUT api/tweet
// @desc   Modify an existing tweet as a user
// @access Private
router.put("/api/tweet/:tweetId", isAuth, async (req, res) => {
  try {
    const tweetId = req.params.tweetId;
    const tweet = await Tweet.findById(tweetId);
  
    if (!tweet) {
      return res.status(404).send({ error: `Tweet not found with id ${tweetId}` });
    }
  
    tweet.text = req.body.text
    const updatedTweet = await tweet.save();
  
    res.send(updatedTweet);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
})

// @route  DELETE api/tweet
// @desc   delete a tweet as a user
// @access Private
router.delete("/api/tweet/:tweetId", isAuth, async (req, res) => {
  try {
    const tweet = await Tweet.findByIdAndDelete(req.params.tweetId);
    if (!tweet) {
      return res.status(404).send('No tweet found with that ID');
    }
    res.status(200).json({ success: true, msg: "Tweet added successfully" })
  } catch (err) {
    res.status(400).send(err);
  }
})

// Like a Tweet
router.patch('/tweet/:id/like', async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) {
      return res.status(404).send('No tweet found with that ID');
    }
    tweet.likes.push(req.body.userId);
    await tweet.save();
    res.send('Tweet liked successfully');
  } catch (err) {
    res.status(400).send(err);
  }
});

// Remove a Like from a Tweet
router.patch('/tweet/:id/unlike', async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) {
      return res.status(404).send('No tweet found with that ID');
    }
    const index = tweet.likes.indexOf(req.body.userId);
    if (index === -1) {
      return res.status(404).send('Like not found');
    }
    tweet.likes.splice(index, 1);
    await tweet.save();
    res.send('Like removed successfully');
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router

