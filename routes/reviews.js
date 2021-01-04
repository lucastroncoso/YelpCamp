const express = require('express');
const router = express.Router({mergeParams:true})
const {catchAsync, isLoggedIn, isReviewAuthor, validateReview} = require('../utils/middleware')
const controller = require('../controllers/reviews')

router.post('/', isLoggedIn, validateReview, controller.createReview)

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(controller.deleteReview))

module.exports = router;
