const router = require('express').Router()
const { isAuthorized, isVerified } = require('../config/authCheck')
const Users = require('../models/Users')

router.get('/', isAuthorized, isVerified, (req,res)=>{ 
    Users.findById(req.session.user)
    .then((doc)=>{
        if(doc){
            let pfp = doc.pfp
            let fullname = doc.name
            let email = doc.email
            let posts = doc.posts
            let username = doc.username
            let likedPosts = doc.likedPosts
            res.render('profile', {fullname, pfp, email, posts, username, likedPosts})
        }else{
            console.log('no docs')
        }
    }).catch(err => console.log(err))
})

module.exports = router