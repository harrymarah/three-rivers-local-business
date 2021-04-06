const Review = require('../models/review');
const Business = require('../models/business');

module.exports.createReview = async(req, res) => {
    const business = await Business.findById(req.params.id); 
    const review = new Review(req.body.review);
    review.author = req.user._id;
    business.reviews.push(review);
    await review.save();
    await business.save();
    req.flash('success', 'Review added!')
    res.redirect(`/business/${business._id}`)
};

module.exports.deleteReview = async(req, res) => {
    const {id, reviewId} = req.params;
    await Business.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted.');
    res.redirect(`/business/${id}`)
};