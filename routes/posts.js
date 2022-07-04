const router = require('express').Router()
const { isAuthorized } = require('../config/authCheck')
const Posts = require('../models/Posts')

router.get('/', isAuthorized, (req,res)=>{
    res.render('posts')
})

router.post('/newpost', isAuthorized, (req,res) => {
    const file = req.body.fileUrl
    const caption = req.body.caption

    newPost = new Posts({
        'file': file,
        'caption': caption,
        'user': req.session.user 
    })

    newPost.save()
    .then(doc => {
        res.redirect('/profile')
    }).catch(err => console.log(err))
})

module.exports = router