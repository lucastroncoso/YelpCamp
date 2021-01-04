const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { campErrorSchema, reviewErrorSchema} = require('../schemasErrors.js');

module.exports.catchAsync = function (fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Needs to be loged in!');
        return res.redirect('/login')
    }
        next();   
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp.author.equals(req.user._id) ) {
        req.flash('error', 'You dont have permission for that');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id) ) {
        req.flash('error', 'You dont have permission for that');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.validateCampground = (req, res, next) =>{
    const result = campErrorSchema.validate(req.body)
    if (result.error) {
        // console.dir(result.error);
        throw new ExpressError(result.error.message, 400);
    } else {
        next()
    }
}

module.exports.validateReview = (req, res, next) =>{
    const result = reviewErrorSchema.validate(req.body);
    if (result.error) {
        // console.dir(result.error);
        throw new ExpressError(result.error.message, 400);
    } else {
        next()
    }
}
