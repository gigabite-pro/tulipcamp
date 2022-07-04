const router = require('express').Router()
const { isAuthorized } = require('../config/authCheck')
const Posts = require('../models/Posts')
const Users = require('../models/Users')

router.get('/', isAuthorized, (req,res)=>{
    Posts.find()
    .then(docs => {
        res.render('posts', {docs})
    }).catch(err => console.log(err))
})

router.post('/newpost', isAuthorized, (req,res) => {
    const file = req.body.fileUrl
    const caption = req.body.caption

    newPost = new Posts({
        'file': file,
        'caption': caption,
        'userpfp': req.session.user.pfp
    })

    newPost.save()
    .then(() => {
        Users.findById(req.session.user._id)
        .then(doc =>{
            let posts = doc.posts
            posts.push(file)
            doc.markModified('posts')
            doc.save()
            .then(()=>{
                res.redirect('/profile')
            })
            .catch(err => console.log(err))
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
})

module.exports = router