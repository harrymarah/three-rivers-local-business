const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const BusinessSchema = new Schema({
    title: String,
    description: String,
    image: String,
    category: {
        type: String,
        lowercase: true,
        enum: 
            ['local produce', 
            'jewellery', 
            'food and drink', 
            'other']
    },
    location: {
        address: String,
        town: String,
        county: String,
        postcode: String
    },
    onlineOnly: Boolean,
    website: String,
    phone: Number,
    email: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});


module.exports = mongoose.model('Business', BusinessSchema);