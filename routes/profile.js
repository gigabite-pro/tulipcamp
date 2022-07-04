const router = require('express').Router()
const { isAuthorized } = require('../config/authCheck')
const Users = require('../models/Users')

router.get('/', isAuthorized, (req,res)=>{
    Users.findById(req.session.user)
    .then((doc)=>{
        if(doc){
            let pfp = doc.pfp
            let fullname = doc.name
            let email = doc.email
            res.render('profile', {fullname, pfp, email})
        }else{
            console.log('no docs')
        }
    }).catch(err => console.log(err))
})

module.exports = router