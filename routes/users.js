const express = require('express');
const controller = require('../controllers/users')
const router = express.Router();
const { catchAsync } = require('../utils/middleware')
const passport = require('passport');

router.get('/register', controller.renderRegisterForm)

router.post('/register', catchAsync(controller.createNewUser))

router.get('/login', controller.renderLogginForm)

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), controller.logginUser)

router.get('/logout', controller.logoutUser)

module.exports = router;