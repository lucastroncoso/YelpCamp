const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
}

module.exports.createNewUser = async(req, res, next) => {
    try{
        const {username, password, email} = req.body;
    const user = new User({username, email});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if(err){
            next(err)
        }
        else{
            req.flash('success', 'User created!')
            res.redirect('campgrounds')
        }
    })} 
    catch(e){
        req.flash('error', e.message);
        res.redirect('register')
    } 
}

module.exports.renderLogginForm = (req, res) => {
    res.render('users/login')
}

module.exports.logginUser = (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirect = req.session.returnTo || 'campgrounds';
    delete req.session.returnTo;
    res.redirect(redirect)
}

module.exports.logoutUser = (req, res) => {
    req.logOut();
    req.flash('success', 'Bye Perri');
    res.redirect('campgrounds')
}