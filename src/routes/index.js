// PUBLIC
const public_register = require("./public/register")
const public_login = require("./public/login")

// PRIVATE
const public_user = require("./public/user")
const private_user = require("./private/user")
const private_tweet = require("./private/tweet")
const public_tweet = require("./public/tweet")

module.exports = routes = [
  // PUBLIC
  public_register,
  public_login,
  public_user,
  public_tweet,
  public_login,
  // PRIVATE
  private_user,
  private_tweet
]
