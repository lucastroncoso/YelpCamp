const express = require('express');
const router = express.Router()
const {isLoggedIn, validateCampground, catchAsync, isAuthor} = require('../utils/middleware')
const controller = require('../controllers/campgrounds')
const multer = require('multer');
var upload = multer({ dest: 'uploads/' })
// const { storage } = require('../cloudinary');
// const upload = multer({ storage });


// ALL CAMPGROUNDS
router.get('/', catchAsync(controller.index))
// CREATE NEW CAMPGROUND (FORM!!)
router.get('/new', isLoggedIn, controller.renderNewForm)
// CREATE A NEW CAMPGROUND AND REDIRECT
// router.post('/', isLoggedIn, validateCampground ,catchAsync(controller.createCampground))
router.post('/', upload.single('image'), (req, res) => {
    console.log(req.body, req.file)
    res.send(req.body.image)
})
// SHOW ONE CAMPGROUND
router.get('/:id', catchAsync(controller.showCampground))
// EDIT CAMPGROUND FORM!!
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(controller.renderEditForm))
// EDITING ONE AND REDIRECT
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(controller.editCampground))
// DELETEE
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(controller.deleteCampground))

module.exports = router;