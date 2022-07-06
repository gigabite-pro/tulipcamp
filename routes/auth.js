const router = require('express').Router()
const axios = require('axios')
const urlParse = require('url-parse');
const qs = require('query-string')
const Users = require('../models/Users')
require('dotenv').config()

redirectUri = process.env.REDIRECT_URI

function getGoogleAuthURL(){
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    const options = {
        redirect_uri: redirectUri,
        client_id: process.env.GOOGLE_CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ].join(" "),
    }
    
    return `${rootUrl}?${qs.stringify(options)}`
}

function getTokens({code, clientId, clientSecret, redirectUri}){
    const url = 'https://oauth2.googleapis.com/token'
    const options = {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
    }

    return axios.post(url, qs.stringify(options), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    })
    .then((res)=> res.data)
    .catch(err => console.log(err))
}

router.get('/login', (req, res) => {
    res.redirect(getGoogleAuthURL())
})

router.get('/callback',async (req, res) => {
    const queryUrl = new urlParse(req.url)
    const code = qs.parse(queryUrl.query).code

    const {id_token, access_token} = await getTokens({
        code,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: redirectUri, 
    })

    const googleUser = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${access_token}`,
        {
            headers: {
                Authorization: `Bearer ${id_token}`
            },
        }
    )
    .then((res)=> res.data)
    .catch(err => console.log(err))

    const user = await Users.findOne({email: googleUser.email})
    if(user){
        req.session.user = user
        if(user.isVerified){
            res.redirect('/posts')
        }else{
            res.redirect('/auth/verify')
        }
    }else{
        const newUser = new Users({
            name: googleUser.name,
            email: googleUser.email,
            pfp: googleUser.picture,
        })
    
        newUser.save()
        .then(
            (resp)=>{  
                req.session.user = resp
                res.redirect('/auth/verify')
            }
        )
        .catch(err => console.log(err))   
    }
})

router.get('/verify', (req,res)=>{
    let user = req.session.user
    res.render('verify', {user})
})

router.get('/checkuser', (req,res)=>{
    let user = req.query.user

    Users.findOne({username: user})
    .then(doc => {
        if(doc){
            res.json({
                data : true
            })
        }else{
            res.json({
                data : false
            })
        }
    })
    .catch(err => console.log(err))
})

router.post('/verifyuser', (req,res)=>{
    const username = req.body.username

    Users.findById(req.session.user._id)
    .then(doc => {
        doc.isVerified = true
        doc.username = username
        doc.save()
        .then((user)=>{
            req.session.user = user
            res.redirect('/profile')
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

router.get('/logout', (req,res)=>{
    req.session.destroy()
    res.redirect('/')
})

module.exports = router