const router = require('express').Router()
const { isAuthorized } = require('../config/authCheck')

router.get('/', isAuthorized, (req,res)=>{
    res.render('posts')
})

module.exports = router