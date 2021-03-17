const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const Business = require('../models/business');
const {businessSchema} = require('../schemas');

const categories = ['local produce', 'jewellery', 'food and drink', 'other']

const validateBusiness = (req, res, next) => {
    const {error} = businessSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const businesses = await Business.find({});
    res.render('businesses/index', {businesses});
}))

router.get('/new', (req, res) => {
    res.render('businesses/new', {categories});
})

router.post('/', validateBusiness, catchAsync(async (req, res, next) => {
    const business = new Business(req.body.business);
    await business.save();
    req.flash('success', 'Sucessfully added a new business!');
    res.redirect(`business/${business._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const {id} = req.params
    const business = await Business.findById(id).populate('reviews');
    if(!business){
        req.flash('error', 'Business doesn\'t exist');
        res.redirect('/business')
    }
    res.render('businesses/show', {business});
}))


router.get('/:id/edit', catchAsync(async (req, res) => {
    const {id} = req.params
    const business = await Business.findById(req.params.id);
    if(!business){
        req.flash('error', 'Business doesn\'t exist');
        res.redirect('/business')
    }
    res.render('businesses/edit', {business, categories});
}))

router.put('/:id', validateBusiness, catchAsync(async (req, res) => {
    const {id} = req.params
    const business = await Business.findByIdAndUpdate(id, {...req.body.business});
    req.flash('success', 'Sucessfully updated your business.')
    res.redirect(`/business/${business._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const business = await Business.findByIdAndDelete(id);
    res.redirect('/business');
}))

module.exports = router;