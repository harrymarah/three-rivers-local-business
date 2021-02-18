const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const {businessSchema, reviewSchema} = require('./schemas');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/expressError')
const methodOverride = require('method-override');
const Business = require('./models/business');
const Review = require('./models/review');

const categories = ['local produce', 'jewellery', 'food and drink', 'other']

mongoose.connect('mongodb://localhost:27017/local-business', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
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

const validateBusiness = (req, res, next) => {
    const {error} = businessSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    } else {
        next();
    }
}

app.get('/', (req, res)=> {
    res.render('home');
})

app.get('/businesses', catchAsync(async (req, res) => {
    const businesses = await Business.find({});
    res.render('businesses/index', {businesses});
}))

app.get('/business/new', (req, res) => {
    res.render('businesses/new', {categories});
})

app.post('/businesses', validateBusiness, catchAsync(async (req, res, next) => {
        const business = new Business(req.body.business);
        await business.save();
        res.redirect(`business/${business._id}`)
}))

app.get('/business/:id', catchAsync(async (req, res) => {
    const {id} = req.params
    const business = await Business.findById(id);
    res.render('businesses/show', {business});
}))


app.get('/business/:id/edit', catchAsync(async (req, res) => {
    const {id} = req.params
    const business = await Business.findById(req.params.id);
    res.render('businesses/edit', {business, categories});
}))

app.put('/business/:id', validateBusiness, catchAsync(async (req, res) => {
    const {id} = req.params
    const business = await Business.findByIdAndUpdate(id, {...req.body.business});
    res.redirect(`/business/${business._id}`)
}))

app.delete('/business/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const business = await Business.findByIdAndDelete(id);
    res.redirect('/businesses');
}))

app.post('/business/:id/reviews', validateReview, catchAsync( async(req, res) => {
    const business = await Business.findById(req.params.id); 
    const review = new Review(req.body.review);
    business.reviews.push(review);
    await review.save();
    await business.save();
    res.redirect(`/business/${business._id}`)
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Something went wrong.'} = err;
    if(!err.message) err.message = 'Oh no, something went wrong!'
    res.status(statusCode).render('error', {err})
})

app.listen(8080, () => console.log('Serving on port 8080'))
