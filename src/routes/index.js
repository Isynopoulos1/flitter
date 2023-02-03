const register = require("./public/register")
const user = require("./private/user")
const createTweet = require('./private/tweet')
const getTweet = require('./public/tweet')


module.exports = routes = [register, user, createTweet, getTweet]
