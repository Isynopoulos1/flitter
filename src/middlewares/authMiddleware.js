const jwt = require('jsonwebtoken')
const { config } = require("../../config")


module.exports = (req, res, next) => {
    const token = req.cookies.jwt

    //CHECK JWT EXISTS AND IS VERIFIED
    if (token) {
        jwt.verify(token, config.jwt_token, (err, decodedToken) => {
            if (err) {
                console.log(err.message)
                res.redirect('/api/login')
            } else {
                console.log(decodedToken)
                next()
            }
        } )
    } else {
        res.redirect('/api/login')
    }

}
