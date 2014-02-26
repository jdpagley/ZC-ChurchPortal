/**
 * Created by Josh Pagley on 2/25/14.
 */

module.exports = function(app) {

    app.get('/portal', isLoggedIn, function(req, res) {
        res.render('portal/index', {
            user: req.user // get user out of session and pass to template
        });
    });

    app.get('/partials/*', isLoggedIn, function(req, res) {
        res.render('../../public/app/' + req.params);
    });

}

// route middleware to make sure user is logged in.
function isLoggedIn(req, res, next){
    //if user is logged in the session, carry on
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/');
}

function isAuthorizedToViewProfile(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/profile');
    }

    return next();
}