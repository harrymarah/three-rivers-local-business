const Business = require('../models/business');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapboxToken});
const {cloudinary} = require('../cloudinary')

const categories = ['local produce', 'jewellery', 'food and drink', 'other'];


module.exports.index = async (req, res) => {
    const businesses = await Business.find({});
    console.log(req.body)
    res.render('businesses/index', {businesses});
};

module.exports.renderNewForm = (req, res) => {
    res.render('businesses/new', {categories});
};

module.exports.addBusiness = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: Object.values(req.body.business.location).join(', '),
        limit: 1
    }).send()
    const business = new Business(req.body.business);
    business.geometry = geoData.body.features[0].geometry;
    business.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    business.addedBy = req.user._id;
    await business.save();
    console.log(business)
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
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    business.images.push(...imgs);
    await business.save();
    console.log(req.body.deleteImages)
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await business.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Sucessfully updated your business.')
    res.redirect(`/business/${business._id}`)
};

module.exports.destroyBusiness = async (req, res) => {
    const {id} = req.params;
    const business = await Business.findByIdAndDelete(id);
    res.redirect('/business');
};

