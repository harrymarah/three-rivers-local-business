const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const ExpressError = require('./utils/expressError')
const methodOverride = require('method-override');

const businesses = require('./routes/businesses');
const reviews = require('./routes/reviews');

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

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'));
app.use(express.static('public/scripts'))

app.use('/business', businesses)
app.use('/business/:id/reviews', reviews)

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
