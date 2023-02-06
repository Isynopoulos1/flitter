const mongoose = require("mongoose")
const { Schema } = mongoose

const TweetSchema = new Schema(
  {
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true,
      default: ""
    },
    tags: {
      type: [String]
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    ]
  },
  { timestamps: true }
)

module.exports = Tweet = mongoose.model("Tweet", TweetSchema)
