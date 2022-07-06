const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const notifsRoute = require('./routes/notifs');
const profileRoute = require('./routes/profile');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 3000

//Middlewares
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(express.urlencoded({extended: true}));
app.use(
    session({
      secret: `${process.env.SESSION_SECRET}`,
      cookie: {
        maxAge: 60000 * 60 * 24,
      },
      saveUninitialized: false,
      resave: false,
    })
  );
app.use(express.json());

//db connection
mongoose.connect(process.env.DB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err=>console.log(err))


//Non-Routes
app.get('/', (req, res) => {
    if(req.session.user){
        res.redirect('/posts')
    }else{
        res.render('index')
    }
});
app.get('/about', (req, res) => res.render('about'));

//Routes
app.use('/auth', authRoute);
app.use('/posts', postRoute);
app.use('/notifs', notifsRoute);
app.use('/profile', profileRoute);

// Starting the app
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})