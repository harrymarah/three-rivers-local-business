const { required } = require("joi");

const Joi = require('joi');

module.exports.businessSchema = Joi.object({
    business: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().max(500).required(),
        category: Joi.string().required(),
        location: Joi.object({
            address: Joi.string(),
            town: Joi.string().required(),
            county: Joi.string(),
            postcode: Joi.string(),
        }).required(),
        onlineOnly: Joi.boolean(),
        website: Joi.string().domain().required(),
        phone: Joi.number(),
        email: Joi.string().email().required(),
    }).required(),
    deleteImages: Joi.array()
})

module.exports.reviewSchema  = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(0).max(5),
        body: Joi.string().required()
    }).required()
})