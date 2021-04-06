const express = require('express');
const router = express.Router();
const businesses = require('../controllers/business')
const catchAsync = require('../utils/catchAsync');
const Business = require('../models/business');
const {isLoggedIn, validateBusiness, isOwner} = require('../middleware');

router.route('/')
    .get(catchAsync(businesses.index))
    .post(isLoggedIn, validateBusiness, catchAsync(businesses.addBusiness))

router.route('/new').get(isLoggedIn, businesses.renderNewForm)

router.route('/:id')
    .get(catchAsync(businesses.showBusiness))
    .put(isLoggedIn, isOwner, validateBusiness, catchAsync(businesses.updateBusiness))
    .delete(isLoggedIn, isOwner, catchAsync(businesses.destroyBusiness))

router.route('/:id/edit').get(isLoggedIn, isOwner, catchAsync(businesses.renderEditForm))

module.exports = router;