const Campground = require('../models/campground')


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}
module.exports.createCampground = async (req, res) => {
    const camp = new Campground(req.body.campground);
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', 'You made a new campground!')
    res.redirect(`/campgrounds/${camp._id}`)
}
module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate('author').populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    });
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { camp })
}
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash('error', 'That campground does not exist!');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { camp })
}
module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    const info = req.body.campground;
    const camp = await Campground.findByIdAndUpdate(id, info)
    req.flash('success', 'You update a campground!')
    res.redirect(`/campgrounds/${camp._id}`)
}
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const deleted = await Campground.findByIdAndDelete(id);
    req.flash('success', 'You deleted a campground!')
    res.redirect('/campgrounds')
}