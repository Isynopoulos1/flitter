const register = require("./public/register")
const login = require("./public/login")
const logout = require("./public/logout")  
const userPublic = require("./public/user")  
const user = require("./private/user")
const createTweet = require('./private/tweet')
const getTweet = require('./public/tweet')


module.exports = routes = [register, user, userPublic, createTweet, getTweet, login, logout]
