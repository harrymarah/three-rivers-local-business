const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Business = require('../models/business');
const {isLoggedIn, validateBusiness, isOwner} = require('../middleware');

const categories = ['local produce', 'jewellery', 'food and drink', 'other'];

router.get('/', catchAsync(async (req, res) => {
    const businesses = await Business.find({});
    res.render('businesses/index', {businesses});
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('businesses/new', {categories});
})

router.post('/', isLoggedIn, validateBusiness, catchAsync(async (req, res, next) => {
    const business = new Business(req.body.business);
    business.addedBy = req.user._id;
    await business.save();
    req.flash('success', 'Sucessfully added a new business!');
    res.redirect(`business/${business._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const {id} = req.params
    const business = await (await Business.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('addedBy'));
    if(!business){
        req.flash('error', 'Business doesn\'t exist');
        res.redirect('/business')
    }
    res.render('businesses/show', {business});
}))


router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(async (req, res) => {
    const {id} = req.params
    const business = await Business.findById(req.params.id);
    if(!business){
        req.flash('error', 'Business doesn\'t exist');
        res.redirect('/business')
    }
    res.render('businesses/edit', {business, categories});
}))

router.put('/:id', isLoggedIn, isOwner, validateBusiness, catchAsync(async (req, res) => {
    const {id} = req.params;
    const business = await Business.findByIdAndUpdate(id, {...req.body.business});
    req.flash('success', 'Sucessfully updated your business.')
    res.redirect(`/business/${business._id}`)
}))

router.delete('/:id', isLoggedIn, isOwner, catchAsync(async (req, res) => {
    const {id} = req.params;
    const business = await Business.findByIdAndDelete(id);
    res.redirect('/business');
}))

module.exports = router;