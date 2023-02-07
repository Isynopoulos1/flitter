const express = require("express")
const mongoose = require("mongoose")
const Tweet = require("../../../models/Tweet")
const User = require("../../../models/User")

// DECLARE ROUTER
const router = express.Router()

// @route  GET api/tweet?page=PAGE&limit=LIMIT&search=SEARCH&tag=TAG&sort=SORT
// @desc   Get list of tweets.
// @access Public
router.get("/api/tweet", async (req, res) => {
  // DEFINE VARIABLES
  const { page, limit, search, tag, sort } = req.query

  // ENSURE MIN QUERY ARE DEFINED
  if (!Number.isInteger(parseInt(page)) || !Number.isInteger(parseInt(limit))) {
    return res.status(400).json({ error: "limit or page query cannot be empty" })
  }

  // DEFINE AGGREGATION PIPELINE
  const aggregatePipelines = [
    {
      $match: {
        tags: !tag ? { $ne: [tag] } : { $in: [tag] },
        text: !search ? { $ne: [search] } : { $regex: new RegExp(search, "i") }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "postedBy",
        foreignField: "_id",
        as: "postedBy"
      }
    },
    { $unwind: "$postedBy" },
    {
      $project: {
        _id: true,
        postedBy: {
          _id: true,
          name: true,
          avatar: true
        },
        tags: true,
        text: true,
        likes: true,
        createdAt: true,
        updatedAt: true
      }
    },
    {
      $sort: sort === "ALPHA" ? { text: 1 } : sort === "ZETA" ? { text: -1 } : sort === "LAST" ? { createdAt: 1 } : { createdAt: -1 }
    },
    {
      $facet: {
        tweets: [{ $skip: Number(page) * Number(limit) }, { $limit: Number(limit) }],
        total: [{ $count: "count" }]
      }
    }
  ]

  try {
    // START TRANSACTION
    const tweets = await Tweet.aggregate(aggregatePipelines)

    // RETURN RESULT
    res.status(200).json(tweets)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: `something unexpected happen, ${e}` })
  }
})

// @route  GET api/tweet/:tweetId
// @desc   Get on tweet per ID
// @access Public
router.get("/api/tweet/:tweetId", async (req, res) => {
  // VARIABLES
  const { tweetId } = req.params

  try {
    const tweet = await Tweet.findOne({ _id: tweetId }).populate("postedBy", ["_id", "name", "avatar"])
    return res.status(200).json(tweet)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: `something unexpected happen, ${e}` })
  }
})

// @route  PATCH api/tweet/:id/unlike
// @desc   Unlike a tweet as a user
// @access Private
router.get("/api/tweet/user/:userId", async (req, res) => {
  // VARIABLES
  const { userId } = req.params
  const { ObjectId } = mongoose.Types

  // DEFINE AGGREGATION PIPELINE
  const aggregatePipelines = [
    {
      $match: {
        _id: ObjectId(userId)
      }
    },
    {
      $lookup: {
        from: "tweets",
        localField: "_id",
        foreignField: "postedBy",
        as: "tweets"
      }
    },
    {
      $project: {
        _id: true,
        _id: true,
        name: true,
        avatar: true,
        tweets: true,
        createdAt: true,
        updatedAt: true
      }
    }
  ]

  try {
    const tweets = await User.aggregate(aggregatePipelines)
    res.status(200).json(tweets)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: `something unexpected happen, ${e}` })
  }
})

module.exports = router
