const mongoose = require('mongoose');
const Review = require('./review')
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

BusinessSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


module.exports = mongoose.model('Business', BusinessSchema);