if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/expressError')
const methodOverride = require('method-override');
const passport = require('passport');
const localStratergy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const businessRoutes = require('./routes/businesses');
const reviewRoutes = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/local-business', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'Database Connection Error'));
db.once("open", () => {
    console.log("Database Connection Established Sucessfully")
})

const app = express();

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
// app.use(express.static('public/scripts'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisisatempsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/business', businessRoutes);
app.use('/business/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.get('/', (req, res)=> {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page not found'))
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Something went wrong.'} = err;
    if(!err.message) err.message = 'Oh no, something went wrong!'
    res.status(statusCode).render('error', {err})
})

app.listen(8080, () => console.log('Serving on port 8080'))
