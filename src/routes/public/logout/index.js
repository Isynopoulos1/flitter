const express = require("express")

// DECLARE ROUTER
const router = express.Router()

router.get('/api/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1})
    res.send('user log out')
    res.redirect('/')
})



module.exports = router