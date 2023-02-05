const express = require("express");
const jwt = require("jsonwebtoken")



// // IMPORT UTILS && MODELS
const User = require("../../../models/User")
const { config } = require("../../../../config")

// DECLARE ROUTER
const router = express.Router()


// HANDLE ERRORS 
const handleErrors = (err) => {
    console.log(err.message, err.code)
    let errors = { name: '', password: ''};

    //INCORRECT EMAIL
    if (err.message === 'incorrect username') {
        errors.name = 'that username is not registered'
    }

    //INCORRECT PASSWORD
    if (err.message === 'incorrect password') {
        errors.password = 'that password is incorrect'
    }
    return errors
}

// @route  POST api/login
// @desc   Login API main function
// @access Public
const maxAge = 3 * 24 * 60 * 60
const createToken = (id) => {
    return jwt.sign({ id }, config.jwt_token, {
        expiresIn: maxAge
    });
}


 router.post("/api/login", async (req, res) => {
 // GRABBING THE REQUEST BODY  
     const { name, password } = req.body
     console.log(req.body)

     try {
         const user = await User.login(name, password)
         const token = createToken(user._id)
         res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge* 1000 })
         res.status(200).json({ user: user._id })
     } 
     catch (err) {
         const errors = handleErrors(err)
         res.status(400).json({ errors })
     }
     // console.log(email, password)
     // res.send('user login')
 });


module.exports = router;