const router = require('express').Router()
const { isAuthorized, isVerified } = require('../config/authCheck')
const Posts = require('../models/Posts')
const Users = require('../models/Users')

router.get('/', isAuthorized, isVerified, (req,res)=>{ 
    Users.findById(req.session.user._id)
    .then(doc => {
        if(doc){
            let notifs = doc.notifs
            let posts = []
            if(notifs.length > 0){
                for(let i = 0; i < notifs.length; i++){
                    Posts.findById(notifs[i][2])
                    .then(post => {
                        posts.push(post.file)
                        if(posts.length === notifs.length){
                            res.render('notifs', {notifs,posts})
                        }
                    })
                    .catch(err => console.log(err))
                }
            }else{
                res.render('notifs', {notifs,posts})
            }

        }
    })
    .catch(err => console.log(err))
})

module.exports = router