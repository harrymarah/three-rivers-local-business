const express = require('express');
const router = express.Router({mergeParams: true});
const {reviewSchema} = require('../schemas');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const Business = require('../models/business');
const ExpressError = require('../utils/expressError')

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync( async(req, res) => {
    const business = await Business.findById(req.params.id); 
    const review = new Review(req.body.review);
    business.reviews.push(review);
    await review.save();
    await business.save();
    res.redirect(`/business/${business._id}`)
}))

router.delete('/:reviewId', catchAsync( async(req, res) => {
    const {id, reviewId} = req.params;
    await Business.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/business/${id}`)
}))

module.exports = router;