const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_150');
})

const BusinessSchema = new Schema({
    title: String,
    description: String,
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    images: [ImageSchema],
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
    geometry: {
        type: {
            type: String,
            enum: 'Point',
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
       
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
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


module.exports = mongoose.model('Business', BusinessSchema);