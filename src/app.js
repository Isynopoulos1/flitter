const express = require("express")
const bodyParser = require("body-parser")
const cookieSession = require("cookie-session")
const cookieParser = require("cookie-parser")

// IMPORT MIDDLEWARE
const jwt = require("./middlewares/jwt")

// IMPORT ROUTES
const routes = require("./routes")

const app = express()
const secure = process.env.NODE_ENV !== "test"

// USE MIDDLEWARES
app.set("trust proxy", true)
app.disable("x-powered-by")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieSession({ signed: false, secure }))
app.use(jwt) // AUTHENTICATION GLOBAL MIDDLEWARE
app.use(cookieParser())

routes.map((route) => app.use("/", route))

module.exports = app
