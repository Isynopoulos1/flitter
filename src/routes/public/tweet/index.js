const express = require("express")

const Tweet = require("../../../models/Tweet")

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

module.exports = router
