const router = require('express').Router()
const http = require('http');
const { isAuthorized, isVerified } = require('../config/authCheck')
const Posts = require('../models/Posts')
const Users = require('../models/Users')

router.get('/', isAuthorized, isVerified, (req,res)=>{
    Posts.find()
    .then(docs => {
        Users.findById(req.session.user._id)
        .then(user => {
            res.render('posts', {docs,user})
        })
        .catch(err => console.log(err))
    }).catch(err => console.log(err))
})

router.post('/newpost', isAuthorized, isVerified, (req,res) => {
    let file = req.body.fileUrl
    const caption = req.body.caption

    newPost = new Posts({
        'file': file,
        'caption': caption,
        'userpfp': req.session.user.pfp,
        'username': req.session.user.username,
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

router.get('/like', isAuthorized, isVerified, (req,res) => {
    let post = req.query.id
    let sender = req.query.sender
    let senderpfp = req.query.senderpfp
    let receiver = req.query.receiver
    
    Posts.findById(post)
    .then(doc => {
        // incrementing likes
        doc.likes++
        doc.markModified('likes')
        doc.save()
        .then(()=>{
            // sending notif
            Users.findOne({username : receiver})
            .then(doc => {
                notifs = doc.notifs
                notifs.push([sender,senderpfp,post])
                doc.markModified('notifs')
                doc.save()
                .then(()=>{
                    // adding likedPost
                    Users.findOne({username : sender})
                    .then(doc => {
                        likedPosts = doc.likedPosts
                        likedPosts.push(post)
                        doc.markModified('likedPosts')
                        doc.save()
                        .then(()=>{
                            res.json({
                                data: true
                            })
                        })
                        .catch(err => {
                            console.log(err)
                            res.json({
                                data: false
                            })
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        res.json({
                            data: false
                        })
                    })
                })
                .catch(err => {
                    console.log(err)
                    res.json({
                        data: false
                    })
                })
            })
            .catch(err => {
                console.log(err)
                res.json({
                    data: false
                })
            })
        })
        .catch(err => {
            console.log(err)
            res.json({
                data: false
            })
        })
    })
    .catch(err => {
        console.log(err)
        res.json({
            data: false
        })
    })
})

module.exports = router