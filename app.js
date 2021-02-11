const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const Business = require('./models/business');

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

app.get('/', (req, res)=> {
    res.render('home');
})

app.get('/businesses', async (req, res) => {
    const businesses = await Business.find({});
    res.render('businesses/index', {businesses});
})

app.get('/business/new', (req, res) => {
    res.render('businesses/new', {categories});
})

app.post('/businesses', async (req, res) => {
    try {
        const business = new Business(req.body.business);
        await business.save();
        res.redirect(`business/${business._id}`)
    } catch(e){
        console.log(e)
    }
})

app.get('/business/:id', async (req, res) => {
    const {id} = req.params
    const business = await Business.findById(id);
    res.render('businesses/show', {business});
})


app.get('/business/:id/edit', async (req, res) => {
    const {id} = req.params
    const business = await Business.findById(req.params.id);
    res.render('businesses/edit', {business, categories});
})

app.put('/business/:id', async (req, res) => {
    const {id} = req.params
    const business = await Business.findByIdAndUpdate(id, {...req.body.business});
    res.redirect(`/business/${business._id}`)
})

app.delete('/business/:id', async (req, res) => {
    const {id} = req.params;
    const business = await Business.findByIdAndDelete(id);
    res.redirect('/businesses');
})

app.listen(8080, () => console.log('Serving on port 8080'))
