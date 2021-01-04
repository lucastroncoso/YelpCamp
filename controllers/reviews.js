const Review = require('../models/review')
const Campground = require('../models/campground')

module.exports.createReview = async(req, res) =>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const newReview = new Review(req.body.review);
    campground.reviews.push(newReview);
    newReview.author = req.user._id
    campground.save();
    newReview.save();
    req.flash('success', 'You create a new review!')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteReview = async(req, res) => {
    const {id, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    const result = await Campground.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    req.flash('success', 'You deleted a review')
    res.redirect(`/campgrounds/${id}`)
}