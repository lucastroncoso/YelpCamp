if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}


const express = require('express');
const mongoose = require('mongoose');
const app = express();

const path = require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');

const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('./models/user');

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const userRouter = require('./routes/users')
const campgroundRouter = require('./routes/campgrounds')
const reviewRouter = require('./routes/reviews')

app.engine('ejs', engine);

app.set('view engine', 'ejs');
app.set(path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.message = req.flash('success'),
    res.locals.error = req.flash('error'),
    next()
})

app.use('/', userRouter);
app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);


// PARA URL NO VALIDAS
app.all('*', (req, res, next) => {
    next(new ExpressError('URL not valid', 404))
})

//error catcher
app.use((err, req, res, next) => {
    // const {message = 'Ho no something went wrong', status = 500} = err;
    if (!err.message) err.message = 'Ho no!'
    res.render('error', { err })
})

app.listen(3000, () => {
    console.log('yelpCapm listening!')
})