module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        console.log(req.session.returnTo)
        req.flash('error', 'You must be logged in to do that.');
        return res.redirect('/login');
    }
    next()
}