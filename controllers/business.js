const Business = require('../models/business');
const categories = ['local produce', 'jewellery', 'food and drink', 'other'];


module.exports.index = async (req, res) => {
    const businesses = await Business.find({});
    res.render('businesses/index', {businesses});
};

module.exports.renderNewForm = (req, res) => {
    res.render('businesses/new', {categories});
};

module.exports.addBusiness = async (req, res, next) => {
    const business = new Business(req.body.business);
    business.addedBy = req.user._id;
    await business.save();
    req.flash('success', 'Sucessfully added a new business!');
    res.redirect(`business/${business._id}`)
};

module.exports.showBusiness = async (req, res) => {
    const {id} = req.params
    const business = await Business.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('addedBy');
    if(!business){
        req.flash('error', 'Business doesn\'t exist');
        res.redirect('/business')
    }
    res.render('businesses/show', {business});
};

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params
    const business = await Business.findById(req.params.id);
    if(!business){
        req.flash('error', 'Business doesn\'t exist');
        res.redirect('/business')
    }
    res.render('businesses/edit', {business, categories});
};

module.exports.updateBusiness = async (req, res) => {
    const {id} = req.params;
    const business = await Business.findByIdAndUpdate(id, {...req.body.business});
    req.flash('success', 'Sucessfully updated your business.')
    res.redirect(`/business/${business._id}`)
};

module.exports.destroyBusiness = async (req, res) => {
    const {id} = req.params;
    const business = await Business.findByIdAndDelete(id);
    res.redirect('/business');
};

