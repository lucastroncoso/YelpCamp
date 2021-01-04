const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author:{
        type: Schema.Types.ObjectId,
        ref:'User'
    }
});

CampgroundSchema.post('findOneAndDelete', async (camp) => {
    if (camp.reviews.length) {
        const res = await Review.deleteMany({ _id: { $in: camp.reviews } })
        // console.log(res);
    }
});

const Campground = mongoose.model('Campground', CampgroundSchema);

module.exports =  Campground;