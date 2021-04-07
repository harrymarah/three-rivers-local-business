const {businessSchema, reviewSchema} = require('./schemas');
const ExpressError = require('./utils/expressError');
const Business = require('./models/business');
const Review = require('./models/review')

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in to do that.');
        return res.redirect('/login');
    }
    next()
}

module.exports.validateBusiness = (req, res, next) => {
    const {error} = businessSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    } else {
        next();
    }
}

module.exports.isOwner = async(req, res, next) => {
    const {id} = req.params;
    const business = await Business.findById(id);
    if(!business.addedBy.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/business/${id}`);
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/business/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    } else {
        next();
    }
}