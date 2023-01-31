const mongoose = require("mongoose")
const { Schema } = mongoose

const TweetSchema = new Schema({
  _author: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  text: {
    type: String,
    required: true
  },
  tags: {
    type: [String]
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "users"
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = Tweet = mongoose.model("tweets", TweetSchema)
